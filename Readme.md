# Application Name

PLN Ambon Web Monitoring

## Prerequisites

Ensure that your computer has the following installed:

- Node.js v14.x and above

## Installation

1. Install dependencies:
 
  ```
  npm install
  ```

## Configuration

1. Make sure to configure the configuration file if needed. Example configurations can be found in `config/`. 

## Running the Application

To run the application, use one of the following commands:

1. Production mode
```
npm run start
```

If you want to run the application using pm2, please install pm2 on your server

```
  npm install -g pm2
```

running application

```
  pm2 start index.js --name <name of service>
```

2. Development mode
```
npm run start:dev

```

## Contribution

If you wish to contribute to this project, please follow these steps:

1. Create a new branch:
```
git checkout -b your-feature

```

2. Make changes and commit:
```
git commit -m "Add feature X"
```

3. Push to your branch:
```
git push origin your-feature

```

4. Submit a pull request
