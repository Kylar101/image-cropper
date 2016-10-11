$(function () {

  'use strict';

  /**
   * Appends cropper html into the page
   * @param {string} number
   * @param {int} width
   * @param {int} height
   */
  function addCropperHTMLSize(number, width, height){
    if (number){
      $('#croppingArea').append('<div id="' + number + '" class="img-w-preview dynamicImages" style="display:flex;flex-wrap:wrap;"><div class="sizeHeading"><h2>' + width + ' &times; ' + height + ' px</h2></div><div class="img-container ' + number + '"><img id="image" src="img/cat-pouncing.jpg" alt="Picture"></div><div class="dynamic-preview img-preview-' + number + ' preview-lg"></div></div>');
    }
  }

  /**
   * Searchs through selected size options
   * @param {string} chkboxName
   * @returns {string array} checkboxesNumber
   * @returns {int array} checkBoxesUpper
   * @returns {int array} checkBoxesLower
   * @returns {string array} cropperObjects
   */
  function getCheckBoxesSize(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesNumber = [];
    var checkBoxesUpper = [];
    var checkBoxesLower = [];
    var cropperObjects = [];
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
       // And stick the checked ones onto an array...
       if (checkboxes[i].checked) {
          checkboxesNumber.push( $( checkboxes[i] ).data( 'number' ) );
          checkBoxesUpper.push( $( checkboxes[i] ).data( 'upper' ) );
          checkBoxesLower.push( $( checkboxes[i] ).data( 'lower' ) );
          cropperObjects.push( '.' + $( checkboxes[i] ).data( 'number' ) + ' > img' );
       }
    }
    // Return the arrays
    return [
      checkboxesNumber,
      checkBoxesUpper,
      checkBoxesLower,
      cropperObjects
      ]
  }

  // opens the helper Modal
  $('.helpButton').click(function(){
    $('#helpModal').modal();
  });

  // dynamic variables
  var imageSize;
  var cropperSizeData = [];
  var cropperSizeOptions = [];
  var ratioList = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];

  // checks for new sizes and adds it to html
  $('input[name="dynamicSizes"]').change(function(){

    var checking = [];
    imageSize = getCheckBoxesSize('dynamicSizes');

    // checks if size already on screen
    for (var i = 0;i < imageSize[0].length;i++){
      if ($('.'+imageSize[0][i]).length<1){
        addCropperHTMLSize(imageSize[0][i], imageSize[1][i],imageSize[2][i]);
      } else  {
        console.log("element number " + imageSize[0][i] + " exists");
      }
    }

    // checks for on screen sizes
    for (var x = 0;x < ratioList.length;x++){
      if (document.getElementById(ratioList[x])){
        if (checking.includes(ratioList[x])){
          console.log('already in array');
        } else {
          checking.push(ratioList[x]);
        }
      }
    }

    // removes sizes if no longer selected
    for (var t = 0;t <checking.length;t++){
      if(!imageSize[0].includes(checking[t])){
        $('#'+checking[t]).remove();
      }
    }

    // removes all remaining sizes if none selected
    if (imageSize[0].length == 0){
      $('.dynamicImages').remove();
    }

    // checks if there are any cropper objects. Appends Select message if false
    if ($(".dynamicImages").length < 1){
      $('#croppingArea').append('<h2 class="select-message">Please select an image size</h2>');
    } else {
      $('.select-message').remove();
    }


  });

  // adds cropper objects onto the html
  $('input[name="dynamicSizes"]').change(function(){
    for (var i = 0;i < imageSize[0].length;i++) {
      cropperSizeData[i] = $(imageSize[3][i]);
      cropperSizeOptions[i] = {
        aspectRatio: imageSize[1][i] / imageSize[2][i],
        preview: '.img-preview-' + imageSize[0][i],
        minCropBoxWidth: imageSize[1][i],
        minCropBoxHeight: imageSize[2][i],
        dragMode: 'move',
        // cropBoxMovable: false,
        cropBoxResizable: false
      }
      // initialises cropper objects
      cropperSizeData[i].cropper(cropperSizeOptions[i]);


      if (blobURL){
        var new_blobURL = URL.createObjectURL(file);
        cropperSizeData[i].one('built.cropper', function () {
        }).cropper('reset').cropper('replace', new_blobURL);
      }

    }
    
    
  });

  // creates the initial cropper object
  var $image = $('.one > img');
  var $download = $('#download');
  var options = {
        aspectRatio: 572 / 150,
        preview: '.img-preview-one',
        minCropBoxWidth: 572,
        dragMode: 'move',
        cropBoxResizable: false,
        // cropBoxMovable: false
      };


  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // initialises first cropper
  $image.cropper(options);


  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }


  // Download
  if (typeof $download[0].download === 'undefined') {
    $download.addClass('disabled');
  }


  // Options
  $('.docs-toggles').on('change', 'input', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var type = $this.prop('type');
    var cropBoxData;
    var canvasData;

    if (!$image.data('cropper')) {
      return;
    }

    if (type === 'checkbox') {
      options[name] = $this.prop('checked');
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');

      options.built = function () {
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      };
    } else if (type === 'radio') {
      options[name] = $this.val();
    }

    $image.cropper('destroy').cropper(options);
  });

  var allResult = [];

  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var $target;
    var result;
    var dynamicResult = [];

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if ($image.data('cropper') && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'rotate') {
        $image.cropper('clear');
      }

      if (imageSize){
        for (var i = 0;i<imageSize[0].length;i++){
          dynamicResult.push(cropperSizeData[i].cropper(data.method, data.option, data.secondOption));
        }
      } else {
        result = $image.cropper(data.method, data.option, data.secondOption);
      }

      if (data.method === 'rotate') {
        $image.cropper('crop');
      }

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':

            if (imageSize){
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(dynamicResult);
            } else {
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
            }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  });


  // Import image
  var $inputImage = $('#inputImage');
  var URL = window.URL || window.webkitURL;
  var blobURL;
  var files;
  var file;

  if (URL) {
    $inputImage.change(function () {
      files = this.files;

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          blobURL = URL.createObjectURL(file);
            if (imageSize){
              for (var i = 0;i<imageSize[0].length;i++){
                cropperSizeData[i].one('built.cropper', function () {

                  // Revoke when load complete
                  URL.revokeObjectURL(blobURL);
                }).cropper('replace', blobURL);
              }
            } else {
              $image.one('built.cropper', function () {

                // Revoke when load complete
                URL.revokeObjectURL(blobURL);
              }).cropper('replace', blobURL);
            }

          $inputImage.val('');
        } else {
          swal('Whoops!','Please choose an image file','error');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }

});
