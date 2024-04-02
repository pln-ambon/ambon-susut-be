const moment = require("moment")

const {
  getAllScadaUnit,
  getAllScadaUnitMeter,
  get24HourLatestData,
  getDataEvery5Minutes
} = require("../model/scada_unit.model")

async function getAllUnit(req, res) {
  try {
    
    const units = await getAllScadaUnit()

    res.status(200).json(units)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getAllUnitMeter(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const groupedData = data.reduce((acc, obj) => {
      const key = obj.unit_name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getDataMap(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    let time

    const groupedData = data.reduce((acc, obj) => {
      const key = obj.unit_name;
      if (!acc[key]) {
        acc[key] = {
          pTotal: 0,
          vTotal: 0,
          vLength: 0,
          vAverage: 0,
          fTotal: 0,
          fAverage: 0,
        }
      }

      // set time 
      if (!time) {
        time = obj.time
      }

      acc[key].pTotal += obj.p / 1000 // MW
      acc[key].vTotal += obj.v
      acc[key].fTotal += obj.f
      if (obj.v) {
        acc[key].vLength += 1
      }
      acc[key].vAverage = acc[key].vTotal / acc[key].vLength
      acc[key].fAverage = acc[key].fTotal / acc[key].vLength
    
      return acc;
    }, {});

    groupedData.date = moment(time).utc().locale('id').format('DD MMMM YYYY, HH:mm [WIT]')

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getTableTotal(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    let daya = 0
    let dmp = 0
    let voltage = 0
    let curent = 0
    let cos_phi = 0
    let freq = 0
    let susut = 0
    let dataNotNull = 0

    data?.forEach(val => {
      daya += (val.p || 0) / 1000 // MW
      dmp += (val.p_dmp || 0) / 1000 // MW
      voltage += val.v || 0
      curent += val.i || 0
      cos_phi += val.pf || 0
      freq += val.f || 0
      susut += val.susut || 0
      if (val.v) {
        dataNotNull += 1
      }
    })

    const result = {
      daya,
      dmp,
      voltage: voltage / dataNotNull,
      curent: curent / dataNotNull,
      cos_phi: cos_phi / dataNotNull,
      freq: freq / dataNotNull,
      susut,
    }

    res.status(200).json(result)
    // res.status(200).json("SUccessSS")
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}


async function getTableDetail(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const grandTotal = {
      p: 0,
      p_dmp_netto: 0,
      p_dmp_pasok: 0,
      vAverage: 0,
      vLength: 0,
      vTotal: 0
    }

    const groupedData = data.reduce((acc, obj) => {
      const key = obj.unit_name;
      if (!acc[key]) {
        acc[key] = {
          total: {
            p_dmp_netto: 0,
            p_dmp_pasok: 0,
            p: 0,
            vTotal: 0,
            vLength: 0,
            vAverage: 0,
          },
          detail: []
        }
      }
    
      // total
      acc[key].total.p_dmp_netto += obj.p_dmp_netto / 1000 // MW
      acc[key].total.p_dmp_pasok += obj.p_dmp_pasok / 1000
      acc[key].total.p += obj.p / 1000
      acc[key].total.vTotal += obj.v // KV
      if (obj.v) {
        acc[key].total.vLength += 1
      }
      acc[key].total.vAverage = acc[key].total.vTotal / acc[key].total.vLength
    
      // detail
      acc[key].detail.push({
        unit_subname: obj.unit_subname,
        p_dmp_netto: obj.p_dmp_netto / 1000,
        p_dmp_pasok: obj.p_dmp_pasok / 1000,
        p: obj.p / 1000,
        v: obj.v
      })

      // grandTotal
      grandTotal.p += obj.p / 1000
      grandTotal.p_dmp_netto += obj.p_dmp_netto / 1000
      grandTotal.p_dmp_pasok += obj.p_dmp_pasok / 1000
      grandTotal.vTotal += obj.v
      if (obj.v) {
        grandTotal.vLength += 1
      }
    
      return acc;
    }, {});

    grandTotal.vAverage = grandTotal.vTotal / grandTotal.vLength

    groupedData.grandTotal = grandTotal

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getDataGrafikbeban(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const groupedData = data.reduce((acc, obj) => {
      if (obj.unit_id == 11 || obj.unit_id == 12 || obj.unit_id == 13 || obj.unit_id == 14) {
        const key = obj.unit_name;
        if (!acc[key]) {
          acc[key] = 0
        }
  
        // total
        acc[key] += obj.p / 1000
      
        return acc;
      }
      return acc;
    }, {});

    let unitNames = []
    let unitValue = []

    for (let prop in groupedData) {
      unitNames.push(prop)
      unitValue.push(groupedData[prop])
    }

    res.status(200).json({
      unitNames,
      unitValue
    })
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getLatest24Hour(req, res) {
  try {

    let startOfHour = moment().startOf('hour').set({ minute: 0, second: 0 }); // Mulai jam ini, atur menit dan detik menjadi 00:00
    let lastDay = startOfHour.subtract(1, 'day')
    let formattedStartTime = lastDay.format('YYYY-MM-DD HH:mm:ss'); // Format waktu sesuai kebutuhan SQL
    const startTime = new Date(formattedStartTime) 

    const result = {}

    const arr = [
      {
        id: 11,
        name: "PLTMG WAAI"
      },
      {
        id: 12,
        name: "BMPP WAAI"
      },
      {
        id: 13,
        name: "PLTD POKA"
      },
      {
        id: 14,
        name: "PLTD HATIVE KECIL"
      },
    ]

    let arrTotal = []

    for (const item of arr) {
      const data = await get24HourLatestData({unitId: item.id, startTime})
  
      // Membuat objek untuk menyimpan hasil pengelompokan
      const groupedData = {};
  
      // Iterasi melalui array data
      data.forEach(item => {
          // Membuat kunci untuk pengelompokan berdasarkan unit_id dan time
          const time = moment(item.time)
          const key = time.utc().format("YYYY-MM-DD HH:mm")
  
          // Jika kunci belum ada di objek groupedData, inisialisasi dengan array kosong
          if (!groupedData[key]) {
              groupedData[key] = [];
          }
  
          // Memasukkan item ke dalam array yang sesuai dengan kunci
          groupedData[key].push(item);
      });
  
      const labels = []
      const datasets = []
  
      for (const key in groupedData ) {
        const total = groupedData[key].reduce((total, current) => total + current.p, 0);
        labels.push(key)
        datasets.push(total)
      }

      if (!arrTotal?.length) {
        arrTotal = [...datasets]
      } else {
        arrTotal.forEach((item, idx) => {
          arrTotal[idx] += datasets[idx]
        })
      }

      result[item.name] = {
        labels,
        datasets
      }

    }

    // calculate total
    result.arrTotal = arrTotal

    res.status(200).json(result)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getLatest24HourEvery5Minute(req, res) {
  try {

    // let startOfHour = moment().utc().startOf('hour').set({ minute: 0, second: 0 }); // Mulai jam ini, atur menit dan detik menjadi 00:00
    // let lastDay = startOfHour.utc().subtract(1, 'day')
    // let formattedStartTime = lastDay.utc().format('YYYY-MM-DD HH:mm:ss'); // Format waktu sesuai kebutuhan SQL
    // // const startTime = new Date(formattedStartTime) 

    const result = {}

    const arr = [
      {
        id: 11,
        name: "PLTMG WAAI"
      },
      {
        id: 12,
        name: "BMPP WAAI"
      },
      {
        id: 13,
        name: "PLTD POKA"
      },
      {
        id: 14,
        name: "PLTD HATIVE KECIL"
      },
    ]

    let arrTotal = []

    for (const item of arr) {
      const data = await getDataEvery5Minutes({unitId: item.id})
  
      // Membuat objek untuk menyimpan hasil pengelompokan
      const groupedData = {};
  
      // Iterasi melalui array data
      data.forEach(item => {
          // Membuat kunci untuk pengelompokan berdasarkan unit_id dan time
          const time = moment(item.time)
          const key = time.utc().format("YYYY-MM-DD HH:mm")
  
          // Jika kunci belum ada di objek groupedData, inisialisasi dengan array kosong
          if (!groupedData[key]) {
              groupedData[key] = [];
          }
  
          // Memasukkan item ke dalam array yang sesuai dengan kunci
          groupedData[key].push(item);
      });
  
      const labels = []
      const datasets = []
  
      for (const key in groupedData ) {
        const total = groupedData[key].reduce((total, current) => total + current.p, 0);
        labels.push(key)
        datasets.push(total)
      }

      if (!arrTotal?.length) {
        arrTotal = [...datasets]
      } else {
        arrTotal.forEach((item, idx) => {
          arrTotal[idx] += datasets[idx]
        })
      }

      result[item.name] = {
        labels,
        datasets
      }

    }

    // calculate total
    result.arrTotal = arrTotal

    res.status(200).json(result)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

module.exports = {
  getAllUnit,
  getAllUnitMeter,
  getDataMap,
  getTableTotal,
  getTableDetail,
  getDataGrafikbeban,
  getLatest24Hour,
  getLatest24HourEvery5Minute
}