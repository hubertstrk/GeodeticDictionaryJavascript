'use strict'

App.Options = {
    method: 'GET',
    headers: { "Api-Key": "[api key]" }
}

let timeout
//let table 

$(document).ready(function(){
    console.log('=> search.js loaded')

    $('#menu li').removeClass('active')  
    $('#menu-home').addClass('active') 

    const input = document.querySelector('#input');
    const message = document.querySelector('#message-wrapper')
    const $message = $(message)
    input.focus()

    /*table = $('#table-result').DataTable({
        paging:   true,
        ordering: true,
        info:     true,
        searching: false,
        select: false,
        responsive: true,
        rowCallback: function( row, data, index ) {
            $(row).addClass('fadein')
            var indexStart = data[0].indexOf(input.value);
            var endIndex = indexStart + input.value.length;
            var cellHtml = data[0].substring(0, indexStart) +
                "<span class=\"highlighted\">" + data[0].substring(indexStart, endIndex) + "</span>" +
                data[0].substring(endIndex, data[0].length + 1);
            row.querySelectorAll('td')[0].innerHTML = cellHtml;
        }
    })*/

    $message.on('click', 'a', function (event) {
        console.log(this.dataset.value)
        const url = createSimpleSearchUrl(this.dataset.value)
        $message.addClass('hide')
        input.value = this.dataset.value
        $(input).focus()
        search(url)
	});

    input.onkeyup = function(){
        $message.addClass('hide') 
        
        if (!self.fetch){ 
            $(message).removeClass('hide') 
            info.innerHTML = "<div class='alert alert-danger' role='alert'>Request cannot be made: Your browser doesn't support the fetch() api.</div>"
            return;
        }

        if ( !checkText() ) // search if more than three characters
            return

        const animation = document.querySelector('#input-animation')
        $(animation).removeClass('fadeout')
        window.clearTimeout(timeout)
        timeout = setTimeout(function(){
            let text = input.value.toLowerCase()
            var splitted = text.split(" ");
            if (splitted.length > 1) {
                var joined = splitted.join(" +");
                text = joined.toString();
            }

            console.log(` => text: ${text}`)            
            const url = createSimpleSearchUrl(text)

            console.log(` => request starting...${url}`)

            $(animation).addClass('fadeout')
            search(url)
        },300)
    }
})

const search = (url) => {
    fetch(url, App.Options)
        .then(getJson)
        .then(displayResult)
        //.then(changeTableHeader)        
        .catch(displayError)
}

const checkText = () => {
    if ( input.value.length < 3) 
    {
        //table.clear().draw()
        document.querySelector('#table-result').innerHTML = ''
        return false
    }
    return true
}

const getJson = (response) => {
    return response.json()
}

const displayResult = (data) => {
    console.log(' => request finished...')

    const text = input.value.toLowerCase()
    
    if ( data.value.length == 0 )
    {
        //table.clear().draw()
        document.querySelector('#table-result').innerHTML = ''

        const baseUrl = `https://dictionary.search.windows.net/indexes/${App.Settings.PrimaryLanguage}/docs?api-version=2016-09-01&`
        const queryParams = `queryType=full&searchFields=${App.Settings.PrimaryLanguage}&search=${input.value}~3`
        const url = baseUrl + queryParams

        console.log(url)

        fetch(url, App.Options)
            .then(getJson)
            .then(function(data){
                const info = document.querySelector('#message-wrapper')
                $(info).removeClass('hide')
                
                if ( data.value.length <= 0 ){
                    $(info).addClass('fadein')
                    info.innerHTML = `<div class='alert alert-info' role='alert'>Sorry, we neither found any translations nor suggestions. Please check your spelling.</div>`
                    return
                }

                let html = ''
                for (var el of data.value) {
                    const suggestion = el[App.Settings.PrimaryLanguage]
                    html += `<a data-value=${suggestion} href=#>${suggestion}</a>`
                    html += ' '
                }
                $(info).addClass('fadein')
                info.innerHTML = `<div class='alert alert-info' role='alert'>Sorry, no translation found. Did you mean: ${html}</div>`
            })
            .catch(displayError)

        return
    }

    /*table.clear().draw()
    for (var el of data.value) {
        table.row.add([
            el[App.Settings.PrimaryLanguage], el[App.Settings.SubsequentLanguage]
        ])
    }
    table.draw(false)*/

    const style = (translation, text) => {
        var indexStart = translation.indexOf(text);
        var endIndex = indexStart + text.length;
        var cellHtml = translation.substring(0, indexStart) +
            "<span class=\"highlighted\">" + translation.substring(indexStart, endIndex) + "</span>" +
            translation.substring(endIndex, translation.length + 1);
        return cellHtml 
    }

    let html = ''
    html += `<thead><tr><th>${App.Settings.PrimaryLanguageDisplay}</th><th>${App.Settings.SubsequentLanguageDisplay}</th></tr></thead>`
    html += '<tbody>'
    for (var el of data.value) {
        const primaryTranslation = style(el[App.Settings.PrimaryLanguage], text)
        const row = `<tr class='fadein'><td>${primaryTranslation}</td><td>${el[App.Settings.SubsequentLanguage]}</td></tr>`
            html += row
    }
    html += '</tbody>'
    document.querySelector('#table-result').innerHTML = html
}

const createSimpleSearchUrl = (text) => {
    const baseUrl = "https://dictionary.search.windows.net/indexes/translations/docs?api-version=2015-02-28"
    const queryParams = `&queryType=simple&searchFields=${App.Settings.PrimaryLanguage}&search=${text}*&searchMode=all`
    const url = baseUrl + queryParams
    return url
}

const displayError = (error) => {
    const info = document.querySelector('#message-wrapper')
    $(info).removeClass('hide') 
    info.innerHTML = `<div class='alert alert-danger' role='alert'>Request failed. Reason: ${error}</div>`
}