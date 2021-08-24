


<p align="center">
  <a href="https://sqhelper.com">
    <img src="my-app/src/assets/logotransparent.png" alt="Logo" width="291" height="92">
  </a>

  <p align="center">
     A block-based syntax support for SQL
     <br />
    <br />
    <a href="https://sqhelper.com">View Demo</a>
    ·
    <a href="https://github.com/SvenJacobsUni/sqhelper/issues">Report Bug</a>
    ·
    <a href="https://github.com/SvenJacobsUni/sqhelper/issues">Request Feature</a>
  </p>
</p>

## Getting Started

To get a local copy up and running under http://localhost:80 follow these simple steps. <br>
If you want to host on a webserver, change the ip-adress in the docker-compose file (line 22).

### Prerequisites

Install Docker on your Machine : https://docs.docker.com/get-docker/


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/SvenJacobsUni/sqhelper.git
   ```
2. (optional) Change the database password inside docker-compose.yml and SocketServer/dbconf

3. Docker Compose inside the cloned repo
   ```sh
   docker compose up
   ```

## About the Project

This project is part of my bachelor thesis at the University of Siegen, where I study computer science education. <br>
To learn more about the theoretical background of sqhelper, you can read my [published paper](https://ieeexplore.ieee.org/document/9453897).

### Built With

* [Blockly](https://developers.google.com/blockly)
* [Angular](https://angular.io/)
* [NodeJS](https://nodejs.org/)
* [MySQL](https://www.mysql.com/)
* [Docker](https://www.docker.com/)
* [Websockets](https://socket.io/)
* [mxGraph](http://jgraph.github.io/mxgraph/)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

E-Mail: sqhelper@svenjacobs.de
