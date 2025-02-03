# Nkafu framework

## Getting Started

To get started with the Nkafu framework, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
  ```bash
  git clone /home/teddy/projects/personnal/nkafu/nkafu-backend
  cd nkafu-backend
  ```

2. Install dependencies:
  ```bash
  yarn install
  ```
3. Set up environment variables:

Create a `.env` file in the root directory of the project by copying the example file:
```bash
cp .env.example .env
```

Open the `.env` file and update the variables as needed.

### Running the Project

Basically you can run the project using this command :
```bash
yarn start
```
If you develop the project use this instead :
```bash
yarn start:dev
```
If you want to run the project with Docker, use these commands:

On Linux:
```bash
./deployer
```

On Windows:
```bash
deployer.bat
```

On macOS:
```bash
./deployer
```

This will start the development server. You can now open your browser and navigate to `http://localhost:3000` to see the application running.

### Building for Production

To build the project for production, run:
```bash
yarn build
```

This will create an optimized build of the application in the `dist` directory.

### Additional Scripts

- `yarn lint`: Lint the codebase using ESLint.
- `yarn format`: Format the codebase using Prettier.

For more information, refer to the [documentation](./docs).
