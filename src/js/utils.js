import $ from 'jquery'



export default {
    /**
  * Appends cropper html into the page
  * @param {string} number
  * @param {int} width
  * @param {int} height
  */
    addCropperHTMLSize: (number, width, height) => {
        let html = `<div id="${number}" class="dynamicImages" style="display:flex;flex-wrap:wrap;clear:both;">
                        <div class="sizeHeading">
                            <h2>${width} &times; ${height}px</h2>
                        </div>
                        <div class="img-container ${number}"><img id="image" src="img/starter.png" alt="Picture"></div>
                        <div class="preview">
                            <div class="dynamic-preview img-preview-${number} preview-lg"></div>
                        </div>
                    </div>`
        if (number) {
            $('#croppingArea').append(html);
        }
    },

    /**
   * Adds sizes from json file
   * 
   */
    addLocalSizingOptions: (json) => {
        $.each(json, function (i) {
            let option = `<div class="sizeOptions">
                            <label class="checkbox">
                                <input type="checkbox" name="dynamicSizes" class="dynamicSizes" value="${json[i].value}" data-number="${json[i].identifier}" data-upper="${json[i].upper}" 
                                    data-lower="${json[i].lower}">
                                ${json[i].upper} &times; ${json[i].lower}px &mdash; ${json[i].name}
                                <span class="sizeUse"> Use: </span>${json[i].use}
                            </label>
                        </div>`
            $('.firstSize').after(option);
        })
    },

    /**
   * Adds sizes from json file
   * 
   */
    addSizingOptions: () => {
        $.getJSON('json/sizes.json', function (json) {
            $.each(json, function (i) {
                let option = `<div class="sizeOptions">
                                <label class="checkbox">
                                    <input type="checkbox" name="dynamicSizes" class="dynamicSizes" value="${json[i].value}" data-number="${json[i].identifier}" data-upper="${json[i].upper}" 
                                        data-lower="${json[i].lower}">
                                    ${json[i].upper} &times; ${json[i].lower}px &mdash; ${json[i].name}
                                    <span class="sizeUse"> Use: </span>${json[i].use}
                                </label>
                            </div>`
                $('.firstSize').after(option);
            });
        });
    },

    /**
   * Adds branding objects from json file
   *
   */
    addBrandingOptions: () => {
        $.getJSON('json/branding.json', function (json) {
            $.each(json, function (i) {
                let option = `<div class="brandingOptions">
                                <label class="checkbox">
                                    <input type="checkbox" name="dynamicBrands" class="dynamicBrands" data-location="${json[i].location}" data-number="${json[i].number}">
                                    ${json[i].name} &mdash; 
                                    <span class="sizeUse">Description: </span>${json[i].description}
                                </label>
                            </div>`
                $('.brandingInstructions').after(option);
            });
        });
    },

    /**
     * Collects all identifiers from size options
     * @param {string} chkboxName
     * @returns {string array} sizeOptions
     */
    getSizeIdentifiers: (chkboxName) => {
        let options = document.getElementsByName(chkboxName);
        let sizeOptions = [];
        for (var i = 0; i < options.length; i++) {
            // console.log($(options[i]).data('number'))
            sizeOptions.push($(options[i]).data('number'))
        }

        return sizeOptions
    },


    /**
    * Searchs through selected size options
    * @param {string} chkboxName
    * @returns {string array} checkboxesNumber
    * @returns {int array} checkBoxesUpper
    * @returns {int array} checkBoxesLower
    * @returns {string array} cropperObjects
    */
    getCheckBoxesSize: (chkboxName) => {
        var checkboxes = document.getElementsByName(chkboxName);
        var checkboxesNumber = [];
        var checkBoxesUpper = [];
        var checkBoxesLower = [];
        var cropperObjects = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkboxes[i].checked) {
                checkboxesNumber.push($(checkboxes[i]).data('number'));
                checkBoxesUpper.push($(checkboxes[i]).data('upper'));
                checkBoxesLower.push($(checkboxes[i]).data('lower'));
                cropperObjects.push(`.${$(checkboxes[i]).data('number')} > img`);
            }
        }
        // Return the arrays
        return [
            checkboxesNumber,
            checkBoxesUpper,
            checkBoxesLower,
            cropperObjects
        ]
    },

    /**
     * Searchs through selected size options
     * @param {string} chkboxName
     * @returns {string array} checkboxesLocation
     * @returns {int array} checkBoxesNumber
     */
    getBrandingOptions: (chkboxName) => {
        var checkboxes = document.getElementsByName(chkboxName);
        var checkboxesLocation = [];
        var checkBoxesNumber = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkboxes[i].checked) {
                checkboxesLocation.push($(checkboxes[i]).data('location'));
                checkBoxesNumber.push($(checkboxes[i]).data('number'));
            }
        }
        // Return the arrays
        return [
            checkboxesLocation,
            checkBoxesNumber
        ]
    },

    /**
     * Filters through images on modal and downloads them in jpg format
     * @param {string} link
     * @param {string} filename
     */
    downloadCanvas: (link, filename) => {
        $('.modal-body canvas').each(function (i) {
            var dataUrl = this.toDataURL('image/jpeg')
            var cropperNumber = i + 1;
            $('#download').attr({
                href: this.toDataURL('image/jpeg'),
                download: `${filename}-${cropperNumber}.jpg`
            })[0].click();
        });
        $('#closemodal').click();
    },

    /**
     * Adds the branding to the downloadable canvas'
     * @param {string} imagePath
     */
    addBrandingAndDownload: (imagePath) => {
        $('.modal-body canvas').each(function (i) {
            var brandImage = new Image();

            brandImage.src = imagePath;
            var canvasContext = this.getContext('2d');
            var currentCanvas = this;

            console.log(currentCanvas.width)

            brandImage.onload = () => {

                canvasContext.drawImage(brandImage, 0, 0, brandImage.width, brandImage.height);
                downloadBrandedCanvas( currentCanvas, 'cropper', i );
            }
        });
    },

    /**
     * Calculates the correct proportions for the branding element and adds to screen
     * @param {string} imagePath
     * @param {string} identifier
     * @param {integer} cropperWidth
     * @param {integer} cropperHeight
     * @returns {result}
     */
    calculateImageDimensions: (imagePath, identifier, cropperWidth, cropperHeight) => {
        let image = new Image()
        image.src = imagePath

        image.onload = () => {

            let widthCalc = Math.ceil( (image.width / cropperWidth) * 100 )
            $(`#${identifier} .preview`).prepend(`<img class="branding-preview" src=${image.src} style="width:${widthCalc}%!important;max-width:none;">`)
        }
        image.onerror = () => {
            console.log(`can't load image`)
        }
    }
}



    /**
     * Filters through images on modal and downloads them in jpg format
     * @param {canvas} canvas
     * @param {string} filename
     * @param {int} currentCanvas
     */
    function downloadBrandedCanvas (canvas, filename, currentCanvas) {
        var dataUrl = canvas.toDataURL('image/jpeg')
        var cropperNumber = currentCanvas + 1;
        $('#download').attr({
            href: canvas.toDataURL('image/jpeg'),
            download: `${filename}-${cropperNumber}.jpg`
        })[0].click();
        $('#closemodal')[0].click();
    }