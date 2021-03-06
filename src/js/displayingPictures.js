import fetchPictures from "./apiService.js";
import "@babel/polyfill";
import pictureCard from "../templates/picture.hbs";
import _ from "lodash";
import { notice, defaults } from '@pnotify/core';
//-----------------------------------------------------------------------------------------------------//
const refs = {
	input: document.querySelector(".search-input"),
	output: document.querySelector(".js-response"),
	btnLoad: document.querySelector(".loadBtn"),
	btnClear: document.querySelector(".js-clear")
}
//-----------------------------------------------------------------------------------------------------//
let page = 1;
let startPoint = 75;
let currentHeight = 0;
defaults.delay = '2000';
defaults.width = '500px';
//-----------------------------------------------------------------------------------------------------//
refs.input.addEventListener("input", _.debounce(makeRequest, 500));
refs.btnClear.addEventListener("click", clearAll);
refs.btnLoad.addEventListener("click", makeRequest);
//-----------------------------------------------------------------------------------------------------//

function makeRequest(evt) {
	if (evt.type === "click") {
		page += 1;
		currentHeight = refs.output.offsetHeight;
	}
	else {
		page = 1;
		currentHeight = 0;
		refs.output.innerHTML = "";
	}

	fetchPictures(refs.input.value, page)
		.then(data => {
			if (data.totalHits) {
				renderPage(data.hits);
				checkStatusBtnLoad(data.totalHits, refs.output.childElementCount);
			}
			else {
				notice({ text: "Упс. Ничего не найдено=(" });
				checkStatusBtnLoad(0, 0);
			}
		})
		.catch(error => notice({ text: `${error}` }));
}
//-----------------------------------------------------------------------------------------------------//
function renderPage(arr) {
	const markup = `${arr.reduce((acc, el) => acc + pictureCard(el), "")}`;
	refs.output.insertAdjacentHTML("beforeend", markup);
	if (refs.output.offsetHeight + startPoint > currentHeight) {
		window.scrollTo({
			top: currentHeight,
			left: 0,
			behavior: 'smooth'
		});
	}
}
//-----------------------------------------------------------------------------------------------------//
function checkStatusBtnLoad(total, current) {
	if (total === current) {
		refs.btnLoad.classList.add("visually-hidden");
	} else {
		refs.btnLoad.classList.remove("visually-hidden");
	}
}
//-----------------------------------------------------------------------------------------------------//
function clearAll() {
	refs.input.value = "";
	refs.output.innerHTML = "";
	checkStatusBtnLoad(0, 0);
}
//-----------------------------------------------------------------------------------------------------//
