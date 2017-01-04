import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Route from './router/route.js';

render(
	<Provider store = {store}>
		<Route/>
	</Provider>
	,document.getElementById('container')
);