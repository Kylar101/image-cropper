import Cropper from 'cropperjs'
import bsn from 'bootstrap.native'
import $ from 'jquery'
import utils from './utils'

// ----------------------------------------------------
//              Different options Tabs
// ----------------------------------------------------

let tabs = document.getElementById('cropperTabsWrapper')
let tabsCollection = tabs.getElementsByTagName('A')

for (var i = 0; i < tabsCollection.length; i++) {
    new bsn.Tab(tabsCollection[i], // our target
        { // our options
            height: true
        });
}

// ----------------------------------------------------
//                  Cropper Code
// ----------------------------------------------------

utils.addIndividualCropperHTML("test")

var cropperTest = document.querySelector('.test img')
cropperTest = new Cropper( cropperTest, {
    aspectRatio: 16 / 9,
    preview: `.image-preview-test`,
    dragMode: 'move',
})