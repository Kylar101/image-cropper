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
    preview: `.img-preview-test`,
    dragMode: 'move',
})
setTimeout(function() {
    $('.test img + .cropper-container.cropper-bg').css('width', '720px').css('height', '516px')   
    cropperTest.zoomTo(0.7)
    cropperTest.moveTo(0)
}, 100)
