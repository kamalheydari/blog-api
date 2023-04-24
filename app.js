//! Core Module
const path = require('path');

//! Third Prty Module
const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

//! Local Module
const connectDB = require('./config/dataBaseConfiguration');
const { setHeaders } = require('./middlewares/headers');
const { errorHandler } = require('./middlewares/errors');

//! Load Config
dotEnv.config({ path: './config/config.env' });

//! Database Configuration
connectDB();

const app = express();

//! Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders);
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

//! Routes
app.use('/', require('./routes/blog'));
app.use('/users', require('./routes/user'));
app.use('/dashboard', require('./routes/dashboard'));

//! Error Handler
app.use(errorHandler);

//! Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is Running'));