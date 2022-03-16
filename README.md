# O'rganizer project

Links of the projet :

-   Back-end : http://organizer-ygg.herokuapp.com/
-   Front-end : https://organizer-ygg.netlify.app/

## Introduction

This project was made from scratch for the last phase of my studies at O'clock for 4 weeks.
We were organized as a team of 5 people (3 front-end developers and 2 back-end developers).

The schedule for the week was:

-   Week 1:
    -   Meeting with the client for the definition of the need
    -   Creation of documentation and requirements
    -   Realisation of wireframes
    -   MCD-MLD realisation
-   Week 2 & 3: development of the application (front and back)
-   Week 4: testing and bug fixing

## Description of the project

This project was born from a real need from a building materials company in the construction industry.

The client is currently using an excel planning management tool for its manufacturing units.
This tool is only accessible to production line managers.
Employees, on the other hand, do not have access to it.

It is also difficult to administer it because only one user can modify it at a time.

This tool allows you to visualize the day-to-day distribution of teams according to a 5x8 rotation.

It is possible for managers to adjust the organization of positions by modifying the statuses of each employee (adding / deleting the status).

## Project expectations

The application must at least guarantee the existing functionalities but it must allow the addition of future functionalities such as, for example, collaborative exchange functionalities from the management team to the employees.

The application must also be ergonomic and modern.

## Features

Within the window of time we had, we decided to implement the features below:

#### General:

-   The application is available on PC
-   The application is available on mobile

#### Connection:

-   To be able to enter the application, the user must log in via a login page by entering his registration number and password.

#### Visualization of the planning :

-   The application offers the visualization of the planning of a production line which is organized in 5x8
-   The users (user and administrator) of the application see the entire production line schedule

#### User account management:

-   Each user has their own account
-   Each user can view their profile information and change their password
-   Admin can edit each user's information, add and delete users

#### Management of assigned statuses:

-   Admin can change employee status
-   The administrator can add a comment when modifying a status

#### Faction management:

-   Admin can add, edit, delete a faction for a given day

#### Error management :

-   a notification system informing users of the validation or failure of their actions (login, database actions, ...)
-   A 404 page is used to inform a user that the requested page does not exist

## The technologies used

The different technologies used for the project are as follows:

#### Front End Technologies:

-   react
-   Redux (Redux-Toolkit)
-   jsonwebtoken
-   Material UI
-   Sass & CSS
-   HTML
-   Enzyme

#### Backend technologies:

-   Server: NodeJS
-   NodeJS dependencies:
    -   PG
    -   express
    -   dotenv
    -   corns
    -   bcrypt
    -   jsonwebtoken
    -   swagger
    -   Bunyan
    -   Database: Postgres
    -   Sqitch

#### Hosting of the application:

The back-end will be hosted on the HEROKU platform
The front-end will be hosted on the Netlify platform
