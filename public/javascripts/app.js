'use strict'

var App = App || {};

App.Settings = {
	PrimaryLanguage:"german",
	SubsequentLanguage:"english",
	Option:"loose",
    PrimaryLanguageDisplay:"German",
	SubsequentLanguageDisplay:"English"
};

$(document).ready(function(){

    console.log('=> app.js loaded')

    App.Settings.PrimaryLanguage = 'german'
    App.Settings.SubsequentLanguage = 'english'
    App.Settings.Option = 'loose'
    console.log(` => initial settings: ${App.Settings.PrimaryLanguage} - ${App.Settings.SubsequentLanguage}`)

    document.querySelector('#menu-german').onclick = () => {
        App.Settings.PrimaryLanguage = 'german'
        App.Settings.SubsequentLanguage = 'english'
        App.Settings.PrimaryLanguageDisplay = 'German'
        App.Settings.SubsequentLanguageDisplay = 'English'
        setLanguageInfo()
        console.log(` => language changed: ${App.Settings.PrimaryLanguage} - ${App.Settings.SubsequentLanguage}`)
    }
    document.querySelector('#menu-english').onclick = () => {
        App.Settings.PrimaryLanguage = 'english'
        App.Settings.SubsequentLanguage = 'german'
        App.Settings.PrimaryLanguageDisplay = 'English'
        App.Settings.SubsequentLanguageDisplay = 'German'
        setLanguageInfo()
        console.log(` => language changed: ${App.Settings.PrimaryLanguage} - ${App.Settings.SubsequentLanguage}`)
    }
    setLanguageInfo()
})

const setLanguageInfo = () =>{
    const info = document.querySelector('#info-wrapper p')
    info.innerHTML = `${App.Settings.PrimaryLanguage} - ${App.Settings.SubsequentLanguage}`
    const input = document.querySelector('#input')
    input.value = ''
    input.focus()
}