///ENVIRONMENT///
require('dotenv').config();

///IMPORTS///
const express= require('express');
const axios = require('axios');
const ejsLayouts = require ('express-ejs-layouts');
const methodOverride = require('method-override');

///APP SET-UP///
const app = express();
app.set('view engine', 'ejs');

///MIDDLEWARE///
app.use(ejsLayouts);
app.use(express.urlencoded( { edxtended: false }) );
app.use(methodOverride('_method'));


///CONTROLLERS///
//initial back end test--please remove when working
app.get('/', (req, res)=> {
    res.send('Back end route working')
});









///SERVER PORT///
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`)
})