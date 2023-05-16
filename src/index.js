import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Routes from './routes';
import './index.css';
import {store,persistor} from './store';

{/*
    编辑者：F
    功能：入口文件
    说明：此处按照官方文档使用redux
*/}

ReactDOM.render(<Provider store={store}>
    <PersistGate  loading={null} persistor={persistor}>
        <Routes />
    </PersistGate>
</Provider>, document.getElementById('root'));

