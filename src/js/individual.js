import Cropper from 'cropperjs'
import bsn from 'bootstrap.native'
import $ from 'jquery'
import utils from './utils'

let tabs = document.getElementById('cropperTabsWrapper')
let tabsCollection = tabs.getElementsByTagName('A')

for (var i = 0; i < tabsCollection.length; i++) {
    new bsn.Tab(tabsCollection[i], // our target
    { // our options
      height: true
    });
  }