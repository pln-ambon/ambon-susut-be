const moment = require("moment")

const {
  getAllScadaUnitMeter,
  getAllDataGrafik,
  getAllDataGrafikTernate,
  getDataEveryMinutes,
  getLastSpiningAndReserve
} = require("../model/scada_unit.model")

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
          current1: 0,
          current2: 0,
          current3: 0, // GIS PASSO - SIRIMAU 1
          current4: 0, // GIS PASSO - SIRIMAU 2
        }
      }
      // set time 
      if (!time) {
        time = obj.time
      }

      if (obj.unit_id[0] === 11 || obj.unit_id[0] === 12 || obj.unit_id[0] === 13 || obj.unit_id[0] === 14) {
        acc[key].pTotal += obj.p / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }
        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }

      // GI WAAI
      if (obj.unit_id[0] === 51 && (obj.unit_subname === "150-LINE1" || obj.unit_subname === "150-LINE2")) {
        acc[key].pTotal += obj.p / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }

        if (obj.unit_subname === "150-LINE1") {
          acc[key].current1 += obj.i
        }

        if (obj.unit_subname === "150-LINE2") {
          acc[key].current2 += obj.i
        }

        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }

      // GI HATIVE BESAR
      if (obj.unit_id[0] === 55 && (obj.unit_subname === "150-TRAFO1" || obj.unit_subname === "150-TRAFO2")) {
        acc[key].pTotal += obj.p / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }
        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }


      // GI SIRIMAU
      if (obj.unit_id[0] === 54 && (obj.unit_subname === "150-TRAFO1" || obj.unit_subname === "150-TRAFO2")) {
        acc[key].pTotal += obj.p / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }
        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }
    

      // GIS PASSO
      if (obj.unit_id[0] === 53 && (obj.unit_subname === "150-TRAFO1" || obj.unit_subname === "150-TRAFO2")) {
        acc[key].pTotal += obj.p / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }

        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }

      if (obj.unit_id[0] === 53 && obj.unit_subname === "150-WAYAME1") {
        acc[key].current1 += obj.i
      }

      if (obj.unit_id[0] === 53 && obj.unit_subname === "150-WAYAME2") {
        acc[key].current2 += obj.i
      }

      if (obj.unit_id[0] === 53 && obj.unit_subname === "150-SIRIMAU1") {
        acc[key].current3 += obj.i
      }

      if (obj.unit_id[0] === 53 && obj.unit_subname === "150-SIRIMAU2") {
        acc[key].current4 += obj.i
      }
    
      return acc;
    }, {});

    groupedData.date = moment(time).utc().locale('id').format('DD MMMM YYYY, HH:mm [WIT]')

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function getTableTotal(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const spinningAndReserveData = await getLastSpiningAndReserve()

    let daya = 0
    let dmp = 0
    let voltage = 0
    let curent = 0
    let cos_phi = 0
    let freq = 0
    let susut = 0
    let dataNotNull = 0
    let dataFreq = 0
    let passo1 = 0
    let passo2 = 0

    data?.forEach(val => {

      if (val.unit_id[0] === 11 || val.unit_id[0] === 12 || val.unit_id[0] === 13 || val.unit_id[0] === 14) {
        daya += (val.p || 0) / 1000 // MW
        dmp += (val.p_dmp || 0) / 1000 // MW
        susut += val.susut || 0
      }

      if (val.v) {
        voltage += val.v || 0
        curent += val.i || 0
        dataNotNull += 1
      }
      
      if (val.unit_id[0] === 51 && (val.unit_subname === "150-PLTMG TRAFO1" || val.unit_subname === "150-PLTMG TRAFO2")) {
        freq += val.f || 0
        cos_phi += val.pf || 0
      }

      if (val.unit_id[0] === 51 && val.unit_subname === "150-LINE1") {
        passo1 += val.i || 0
      }

      if (val.unit_id[0] === 51 && val.unit_subname === "150-LINE2") {
        passo2 += val.i || 0
      }
    })

    const result = {
      daya,
      dmp,
      voltage: voltage / dataNotNull,
      curent: curent / dataNotNull,
      cos_phi: cos_phi / 2,
      freq: freq / 2,
      passo1,
      passo2,
      susut,
      spinningReserve: spinningAndReserveData.spinning,
      reserveMargin: spinningAndReserveData.reverse
    }

    // Reserve Margin (%) = (DMP-Beban)/Beban

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
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
      if (obj.unit_id[0] === 11 || obj.unit_id[0] === 12 || obj.unit_id[0] === 13 || obj.unit_id[0] === 14) {
        grandTotal.p += obj.p / 1000
        grandTotal.p_dmp_netto += obj.p_dmp_netto / 1000
        grandTotal.p_dmp_pasok += obj.p_dmp_pasok / 1000
        grandTotal.vTotal += obj.v
        if (obj.v) {
          grandTotal.vLength += 1
        }
      }
    
      return acc;
    }, {});

    grandTotal.vAverage = grandTotal.vTotal / grandTotal.vLength

    groupedData.grandTotal = grandTotal

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function getDataGrafikbeban(req, res) {
  try {
    
    const data = await getAllDataGrafik()

    const groupedData = data.reduce((acc, obj) => {
        const key = obj.unit_name;
        if (!acc[key]) {
          acc[key] = 0
        }
  
        // total
        acc[key] += obj.p / 1000
      
        return acc;
    }, {});

    let unitNames = []
    let unitValue = []
    let colors = []

    const objColors = {
      "PLTD HATIVE KECIL": "#d4afb9",
      "PLTD POKA": "#d1cfe2",
      "PLTMG WAAI": "#9cadce",
      "BMPP WAAI": "#7ec4cf",
    }

    for (let prop in groupedData) {
      colors.push(objColors[prop])
      unitNames.push(prop)
      unitValue.push(groupedData[prop])
    }


    res.status(200).json({
      unitNames,
      unitValue,
      colors
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

async function getLatest24HourEveryMinute(req, res) {
  try {

    // let startOfHour = moment().utc().startOf('hour').set({ minute: 0, second: 0 }); // Mulai jam ini, atur menit dan detik menjadi 00:00
    // let lastDay = startOfHour.utc().subtract(1, 'day')
    // let formattedStartTime = lastDay.utc().format('YYYY-MM-DD HH:mm:ss'); // Format waktu sesuai kebutuhan SQL

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
      const data = await getDataEveryMinutes({unitId: item.id})
  
      // Membuat objek untuk menyimpan hasil pengelompokan
      const groupedData = {};
  
      // Iterasi melalui array data
      data.forEach(item => {
          // Membuat kunci untuk pengelompokan berdasarkan unit_id dan time
          const time = moment(item.time)
          const key = time.utc().format("DD MMM HH:mm:ss")
  
          // Jika kunci belum ada di objek groupedData, inisialisasi dengan array kosong
          if (!groupedData[key]) {
              groupedData[key] = [];
          }
  
          // push item ke dalam array yang sesuai dengan kunci
          groupedData[key].push(item);
      });
  
      const labels = []
      const datasets = []
  
      for (const key in groupedData ) {
        const total = groupedData[key].reduce((total, current) => total + Math.round(current.p), 0);
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
    res.status(500).json(error)
  }
}

async function getDataMapTernate(req, res) {
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
          current1: 0,
          current2: 0,
          current3: 0, 
          current4: 0,
        }
      }
      // set time 
      if (!time) {
        time = obj.time
      }
      
      /**
       * 101 => PLTMG KASTELA
       * 102 => PLTU TIDORE
       * 103 => PLTD KAYU MERAH
       * 104 => PLTD KASTELA
       */

      // if (obj.unit_id[0] === 101 || obj.unit_id[0] === 102 || obj.unit_id[0] === 103 || obj.unit_id[0] === 104) {
      //   acc[key].pTotal += Math.abs(obj.p) / 1000 // MW
      //   if (obj.v) {
      //     acc[key].vTotal += obj.v
      //     acc[key].fTotal += obj.f
      //     acc[key].vLength += 1
      //   }
      //   acc[key].vAverage = acc[key].vTotal / acc[key].vLength
      //   acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      // }

      // 102 => PLTU TIDORE
      if (obj.unit_id[0] === 102 && (obj.unit_subname === "GEN1" || obj.unit_subname === "GEN2")) {
        acc[key].pTotal += Math.abs(obj.p) / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }
        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }


      // 152 => GIS KAYU MERAH/GIS TERNATE
      if (obj.unit_id[0] === 152 && (obj.unit_subname === "150-TRAFO1" || obj.unit_subname === "150-TRAFO2")) {
        acc[key].pTotal += Math.abs(obj.p) / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }

        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }

      // 151 => GI KASTELA
      if (obj.unit_id[0] === 151 && (obj.unit_subname === "150-TRAFO1" || obj.unit_subname === "150-TRAFO2")) {
        acc[key].pTotal += Math.abs(obj.p) / 1000 // MW
        if (obj.v) {
          acc[key].vTotal += obj.v
          acc[key].fTotal += obj.f
          acc[key].vLength += 1
        }

        acc[key].vAverage = acc[key].vTotal / acc[key].vLength
        acc[key].fAverage = acc[key].fTotal / acc[key].vLength
      }

      if (obj.unit_id[0] === 151 && obj.unit_subname === "150-LINE1") {
        acc[key].current1 += obj.i
      }

      if (obj.unit_id[0] === 151 && obj.unit_subname === "150-LINE2") {
        acc[key].current2 += obj.i
      }

      return acc;
    }, {});

    groupedData.date = moment(time).utc().locale('id').format('DD MMMM YYYY, HH:mm [WIT]')

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(500).json(error)
  }
} 

async function getDataGrafikbebanTernate(req, res) {
  try {
    
    const data = await getAllDataGrafikTernate()

    const groupedData = data.reduce((acc, obj) => {
        const key = obj.unit_name;
        if (!acc[key]) {
          acc[key] = 0
        }
  
        // total
        acc[key] += Math.abs(obj.p) / 1000
      
        return acc;
    }, {});

    let unitNames = []
    let unitValue = []
    let colors = []

    const objColors = {
      "PLTMG KASTELA": "#d4afb9",
      "PLTD SEWA": "#d1cfe2",
      "PLTD KAYU MERAH": "#9cadce",
      "PLTU TIDORE": "#7ec4cf",
    }

    for (let prop in groupedData) {
      colors.push(objColors[prop])
      unitNames.push(prop)
      unitValue.push(groupedData[prop])
    }


    res.status(200).json({
      unitNames,
      unitValue,
      colors
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

async function getTableTotalTernate(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const spinningAndReserveData = await getLastSpiningAndReserve()

    let daya = 0
    let dmp = 0
    let voltage = 0
    let curent = 0
    let cos_phi = 0
    let freq = 0
    let susut = 0
    let dataNotNull = 0
    let dataFreq = 0
    let passo1 = 0
    let passo2 = 0

    data?.forEach(val => {

      // if (val.unit_id[0] === 101 || val.unit_id[0] === 102 || val.unit_id[0] === 103 || val.unit_id[0] === 104) {
      //   daya += (Math.abs(val.p) || 0) / 1000 // MW
      //   dmp += (Math.abs(val.p_dmp) || 0) / 1000 // MW
      //   susut += val.susut || 0
      // }

      if (val.v) {
        voltage += val.v || 0
        curent += val.i || 0
        dataNotNull += 1
      }
      
      // Frequensi  and Cos phi
      if (val.unit_id[0] === 152 && (val.unit_subname === "150-TRAFO1" || val.unit_subname === "150-TRAFO2")) {
        freq += val.f || 0
        cos_phi += val.pf || 0
      }

      // Total daya
      if ((val.unit_id[0] === 151 && (val.unit_subname === "150-TRAFO1" || val.unit_subname === "150-TRAFO2")) || val.unit_id[0] === 102 || val.unit_id[0] === 103 || val.unit_id[0] === 104) {
        daya += (Math.abs(val.p) || 0) / 1000 // MW
        dmp += (Math.abs(val.p_dmp) || 0) / 1000 // MW
        susut += val.susut || 0
      }

      if (val.unit_id[0] === 151 && val.unit_subname === "150-LINE1") {
        passo1 += val.i || 0
      }

      if (val.unit_id[0] === 151 && val.unit_subname === "150-LINE2") {
        passo2 += val.i || 0
      }
    })

    const result = {
      daya,
      dmp,
      voltage: voltage / dataNotNull,
      curent: curent / dataNotNull,
      cos_phi: cos_phi / 2,
      freq: freq / 2,
      passo1,
      passo2,
      susut,
      spinningReserve: spinningAndReserveData.spinning,
      reserveMargin: spinningAndReserveData.reverse
    }

    // Reserve Margin (%) = (DMP-Beban)/Beban

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = {
  getDataMap,
  getTableTotal,
  getTableDetail,
  getDataGrafikbeban,
  getLatest24HourEveryMinute,
  getDataMapTernate,
  getDataGrafikbebanTernate,
  getTableTotalTernate
}