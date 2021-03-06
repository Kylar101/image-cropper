import $ from 'jquery'
import Cropper from 'cropperjs'
import bsn from 'bootstrap.native'
import utils from './utils'
import './sweetalert.min'
import {
    setTimeout
} from 'timers';

$(function () {

    'use strict';

    // ----------------------------------------------------------------------------------------------
    // ---------------------------------- LOADING CODE ---------------------------------------------
    // ----------------------------------------------------------------------------------------------

    let sizesValue = document.getElementById('sizesValue')
    let brandsValue = document.getElementById('brandsValue')

    function pageLoad() {
        // utils.addSizingOptions()
        // utils.addBrandingOptions()
        let sizes = localStorage.getItem("imageCropperSizes")
        let brands = localStorage.getItem("imageCropperBrands")
        sizesValue.value = sizes
        brandsValue.value = brands
        if (!sizes) {
            $('.sizeInstructions').append('<h2 class="select-message no-sizes">Please enter some sizes</h2>')
        } else {
            $('.no-sizes').remove()
            utils.addLocalSizingOptions(JSON.parse(sizes))
        }

        if (!brands) {
            $('.brandingInstructions').append('<h2 class="select-message no-brands">Please enter some brands</h2>')
        } else {
            $('.no-brands').remove()
            utils.addLocalBrandingOptions(JSON.parse(brands))
        }
    }

    // ----------------------------------------------------------------------------------------------
    // ---------------------------------- BACKBONE CODE ---------------------------------------------
    // ----------------------------------------------------------------------------------------------

    window.onload = pageLoad()

    let helpModalID = document.getElementById('helpModal')
    let helpModal = new bsn.Modal(helpModalID)

    // opens the helper Modal
    $('.helpButton').click(function () {
        // $('#helpModal').modal()
        helpModal.show()
    })

    let sizeModalID = document.getElementById('sizeModal')
    let sizeModal = new bsn.Modal(sizeModalID)

    // opens the helper Modal
    $('.newSizeButton').click(function () {
        sizeModal.show()
    })

    let submitSizes = document.getElementById('submitSizes')
    submitSizes.addEventListener('click', () => {
        localStorage.setItem('imageCropperSizes', sizesValue.value)
        $('.no-sizes').remove()
        $('.sizeOptions').remove()
        utils.addLocalSizingOptions(JSON.parse(sizesValue.value))
    })

    let brandModalID = document.getElementById('brandModal')
    let brandModal = new bsn.Modal(brandModalID)

    // opens the helper Modal
    $('.newBrandingButton').click(function () {
        brandModal.show()
    })

    let submitBrands = document.getElementById('submitBrands')
    submitBrands.addEventListener('click', () => {
        localStorage.setItem('imageCropperBrands', brandsValue.value)
        $('.no-brands').remove()
        $('.brandingOptions').remove()
        utils.addLocalBrandingOptions(JSON.parse(brandsValue.value))
    })

    // first, we reference the .nav component that holds all tabs
    var myTabs = document.getElementById('helpTabs')

    // let's give the initialization a JavaScript reference for the "target" option
    var myTabsCollection = myTabs.getElementsByTagName('A')

    // initialize the component for all items in the collection
    for (var i = 0; i < myTabsCollection.length; i++) {
        new bsn.Tab(myTabsCollection[i], // our target
            { // our options
                height: true
            })
    }

    // dynamic variables
    var imageSize
    var cropperSizeData = []
    var cropperSizeOptions = []
    var branding = false
    var brandingImage = ''
    var brandingDetails = []
    // var ratioList = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
    var ratioList

    // checks for new sizes and adds it to html
    $(document).on('change', 'input[name="dynamicSizes"]', function () {
        console.log('changed')

        // gets identifiers from sizes
        ratioList = utils.getSizeIdentifiers('dynamicSizes')

        var checking = [];
        imageSize = utils.getCheckBoxesSize('dynamicSizes')

        // checks if size already on screen
        for (var i = 0; i < imageSize[0].length; i++) {
            if ($('.' + imageSize[0][i]).length < 1) {
                utils.addCropperHTMLSize(imageSize[0][i], imageSize[1][i], imageSize[2][i])
            } else {
                console.log(`element number ${imageSize[0][i]} exists`)
            }
        }

        // checks for on screen sizes
        for (var x = 0; x < ratioList.length; x++) {
            if (document.getElementById(ratioList[x])) {
                if (checking.includes(ratioList[x])) {
                    console.log('already in array')
                } else {
                    checking.push(ratioList[x])
                }
            }
        }

        // removes sizes if no longer selected
        for (var t = 0; t < checking.length; t++) {
            if (!imageSize[0].includes(checking[t])) {
                $('#' + checking[t]).remove()
            }
        }

        // removes all remaining sizes if none selected
        if (imageSize[0].length == 0) {
            $('.dynamicImages').remove()
        }

        // checks if there are any cropper objects. Displays Select message if false
        if ($(".dynamicImages").length < 1) {
            $('#croppingArea').append('<h2 class="select-message">Please select an image size</h2>')
        } else {
            $('.select-message').remove()
        }

    })

    var $image;
    // adds cropper objects onto the html
    $(document).on('change', 'input[name="dynamicSizes"]', function () {
        $image = imageSize[3][0];
        for (var i = 0; i < imageSize[0].length; i++) {

            cropperSizeData[i] = document.querySelector(imageSize[3][i])
            cropperSizeData[i] = new Cropper(cropperSizeData[i], {
                aspectRatio: imageSize[1][i] / imageSize[2][i],
                preview: `.img-preview-${imageSize[0][i]}`,
                minCropBoxWidth: imageSize[1][i],
                minCropBoxHeight: imageSize[2][i],
                checkCrossOrigin: true,
                dragMode: 'move',
                // cropBoxMovable: false,
                cropBoxResizable: false
            })

            if (blobURL) {
                var new_blobURL = URL.createObjectURL(file)
                cropperSizeData[i].reset().replace(new_blobURL)
            }
            let test = imageSize[3][i]
            setTimeout(() => {
                let selector = test.replace(/ > img/g, '')
                $(`${selector} > .cropper-container.cropper-bg:nth-of-type(2n)`).remove()
            }, 50)
        }

    })

    // zooms image into the correct dimensions
    $(document).on('change', 'input[name="dynamicSizes"]', function () {
        // $(document).on('scroll', function () {
        for (let i = 0; i < imageSize[0].length; i++) {
            setTimeout(function () {
                // getting cropper data 
                let cropBoxData = cropperSizeData[i].getCropBoxData()
                // calculate zoom distance and zooms
                cropperSizeData[i].zoomTo(cropBoxData.width / imageSize[1][i])
                // disables zoom, so users can't break dimensions
                // cropperSizeData[i].setDefaults({ zoomable: false })

            }, 50)
        }
    })
    // adds branding
    $(document).on('change', 'input[name="dynamicBrands"],input[name="dynamicSizes"]', function () {
        var brandingDetails = utils.getBrandingOptions('dynamicBrands')

        brandingImage = brandingDetails[0][0];

        // assigning cropper dimensions to nicer variables
        let cropperIdentifier = imageSize[0]
        let cropperWidth = imageSize[1]
        let cropperHeight = imageSize[2]

        // decides if branding is needed
        if (brandingDetails[0].length) {
            console.log(brandingImage)
            branding = true;

        } else {
            branding = false;
            brandingImage = ''

        }

        // adding branding
        if (branding) {
            // iterates through croppers on screen
            for (let i = 0; i < cropperIdentifier.length; i++) {
                // removes old branding
                $('.branding-preview').remove()
                // adds new branding
                utils.calculateImageDimensions(brandingImage, cropperIdentifier[i], cropperWidth[i], cropperHeight[i])
            }

        } else {
            // removes branding
            $('.branding-preview').remove()
        }

    })



    // assigns download button on modal to jquery object
    var $download = $('#download')

    // Download
    if (typeof $download[0].download === 'undefined') {
        $download.addClass('disabled')
    }

    // export button click
    $('.docs-buttons').on('click', '[data-method]', function () {
        var $this = $(this)
        var data = $this.data()
        var $target;
        var result;
        var dynamicResult = [];

        if (data.method) {

            // some error checking
            if (typeof data.target !== 'undefined') {
                $target = $(data.target)

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val())
                    } catch (e) {
                        console.log(e.message)
                    }
                }
            }

            // adds each of the selected sizes to array of canvas
            // if (imageSize) {
            for (var i = 0; i < imageSize[0].length; i++) {
                dynamicResult.push(cropperSizeData[i][data.method](data.option, data.secondOption))
            }
            // } else {
            //     result = $image.cropper(data.method, data.option, data.secondOption)
            // }

            switch (data.method) {
                // for rotating image - not applicable atm
                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option)
                    break;

                    // brings up download modal
                case 'getCroppedCanvas':

                    // var branding = true;
                    let downloadModalID = document.getElementById('getCroppedCanvasModal')
                    let downloadModal = new bsn.Modal(downloadModalID)
                    // console.log($('#getCroppedCanvasModal').find('.modal-body'))


                    // adds images to modal and downloads
                    if (imageSize) {
                        $('#getCroppedCanvasModal').find('.modal-body').html(dynamicResult)
                        // downloadModal.show()
                    } else {
                        $('#getCroppedCanvasModal').find('.modal-body').html(result)
                        // downloadModal.show()
                    }

                    if (branding) {
                        utils.addBrandingAndDownload(brandingImage)
                    } else {
                        utils.downloadCanvas(this, 'cropper')
                    }

                    break;
            }

            // more error checking
            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result))
                } catch (e) {
                    console.log(e.message)
                }
            }

        }
    })


    // ----------------------------------------------------------------------------------------------
    // ------------------------------------ IMAGE UPLOAD --------------------------------------------
    // ----------------------------------------------------------------------------------------------


    // Import image
    var $inputImage = $('#inputImage')
    var URL = window.URL || window.webkitURL;
    var blobURL;
    var files;
    var file;

    if (URL) {
        // checks if new image is uploaded
        $inputImage.change(function () {
            files = this.files;

            if (files && files.length) {
                file = files[0];

                // checks file type
                if (/^image\/\w+$/.test(file.type)) {
                    // gets uploaded image
                    blobURL = URL.createObjectURL(file)

                    // adds image to all croppers on screen
                    // if (imageSize) {
                    for (var i = 0; i < imageSize[0].length; i++) {

                        let cropBoxData = cropperSizeData[i].getCropBoxData()

                        cropperSizeData[i].replace(blobURL)
                        setTimeout(() => {
                            cropperSizeData[i].zoomTo(cropBoxData.width / imageSize[1][i])
                            URL.revokeObjectURL(blobURL)
                        }, 50)

                        let test = imageSize[3][i]
                        setTimeout(() => {
                            let selector = test.replace(/ > img/g, '')
                            $(`${selector} > .cropper-container.cropper-bg:nth-of-type(2n)`).remove()
                        }, 50)
                    }
                    // } else {
                    //     $image.one('built.cropper', function () {

                    //         // Revoke when load complete
                    //         URL.revokeObjectURL(blobURL)
                    //     }).replace(blobURL)
                    // }

                    $inputImage.val('')
                } else {
                    // error message for wrong file type
                    swal('Whoops!', 'Please choose an image file', 'error')
                }
            }
        })
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled')
    }

})