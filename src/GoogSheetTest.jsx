

import React from 'react'

import {urlToKey, getSheet, getWorkbook} from 'sheetsy'

const manifest = urlToKey('https://docs.google.com/spreadsheets/d/1Dsk_ca9U0XOnyZnmiE4MHSS-4ifyZxxjrju4q-omiRI/edit?usp=sharing')

getWorkbook(manifest).then(workbook => {
	console.log(workbook)
	getSheet(manifest, workbook.sheets[0].id).then(sheet => {
		console.log(sheet)
		let sheetsToActuallyUse = sheet.rows
			.filter((row)=> {return row.show==='yes'||row.show==='true'})
			.map((row)=>{ return {name: row.indicator, show: row.show, url: urlToKey(row.url)}})
		console.log(sheetsToActuallyUse)
		
		let sheetPromises = []

		for(var i = 0; i<sheetsToActuallyUse.length; i++){
			sheetPromises.push(sheetsToActuallyUse[i].url)
		}
		return Promise.all(sheetPromises.map((promiseURL)=>{
			return getWorkbook(promiseURL).then(wb => {
				return getSheet(promiseURL, wb.sheets[0].id).then(indSheet => {
					console.log(indSheet)
					return indSheet
				})
			})
		})).then(()=>{console.log('good show')})

	})


})

export default class SheetTest extends React.Component{

	render(){
		return(
			<div>

			</div>
		)
	}
}