
<p align="center">
  <a href="https://sqhelper.com">
    <img src="my-app/src/assets/logotransparent.png" alt="Logo" width="291" height="92">
  </a>

  <p align="center">
    Block-based syntax support for SQL
    <br />
    <br />
    <a href="https://sqhelper.com">View Demo</a>
    ·
    <a href="https://github.com/SvenJacobsUni/sqhelper/issues">Report Bug</a>
    ·
    <a href="https://github.com/SvenJacobsUni/sqhelper/issues">Request Feature</a>
  </p>
</p>

> **Update 2026:** SQHelper now runs fully in your browser (using SQLite and WebAssembly) without the need for an additional server.

## About the Project

SQHelper provides a visual, block-based interface to help learners understand, use and learn SQL syntax. To learn more about the theoretical background, you can read my [published paper](https://ieeexplore.ieee.org/document/9453897). This project originated from my bachelor's thesis at the University of Siegen, focusing on Computer Science Education.

**Note:** This is the updated **client-side-only version (01.2026)**, which runs completely in the browser.
(The original version is still available in the `original-bachelor-thesis` branch).

### Built With

* [Blockly](https://developers.google.com/blockly)
* [sql.js](https://github.com/sql-js/sql.js)
* [ngx-vflow](https://www.ngx-vflow.org)
* [vizdom](https://github.com/vizdom-dev/vizdom)
* [Angular](https://angular.io/)
* [Docker](https://www.docker.com/)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* **Docker:** Install Docker on your machine: [Get Docker](https://docs.docker.com/get-docker/)
* **Node.js (Optional):** Required only if you are not using Docker.

### Installation

You can run the project using Docker (recommended) or via Node.js directly.

#### Option A: Using Docker
1. Clone the repo
   `git clone https://github.com/SvenJacobsUni/sqhelper.git`

2. Run Docker Compose inside the cloned directory
   `docker compose up`

The app should now be accessible at `http://localhost:80`.

#### Option B: Manual Installation (Node.js)

1. Clone the repo and navigate into the project folder.
2. Install dependencies and start the server:
   `npm install` and
   `npm start`



## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

**Sven Jacobs**

Email: sven.jacobs@uni-siegen.de
