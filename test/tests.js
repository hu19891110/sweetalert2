/* global $, QUnit, swal */

QUnit.test('modal shows up', function (assert) {
  assert.notOk(swal.isVisible())
  swal('Hello world!')
  assert.ok(swal.isVisible())
})

QUnit.test('modal width', function (assert) {
  swal({text: '400px', width: 300})
  assert.equal($('.swal2-modal')[0].style.width, '300px')

  swal({text: '500px', width: '400px'})
  assert.equal($('.swal2-modal')[0].style.width, '400px')

  swal({text: '90%', width: '90%'})
  assert.equal($('.swal2-modal')[0].style.width, '90%')

  swal({text: 'default width'})
  assert.equal($('.swal2-modal')[0].style.width, '500px')
})

QUnit.test('confirm button', function (assert) {
  const done = assert.async()

  swal('Confirm me').then(function (result) {
    assert.equal(result, true)
    done()
  })

  swal.clickConfirm()
})

QUnit.test('custom buttons classes', function (assert) {
  swal({
    text: 'Modal with custom buttons classes',
    confirmButtonClass: 'btn btn-success ',
    cancelButtonClass: 'btn btn-warning '
  })
  assert.ok($('.swal2-confirm').hasClass('btn'))
  assert.ok($('.swal2-confirm').hasClass('btn-success'))
  assert.ok($('.swal2-cancel').hasClass('btn'))
  assert.ok($('.swal2-cancel').hasClass('btn-warning'))

  swal('Modal with default buttons classes')
  assert.notOk($('.swal2-confirm').hasClass('btn'))
  assert.notOk($('.swal2-confirm').hasClass('btn-success'))
  assert.notOk($('.swal2-cancel').hasClass('btn'))
  assert.notOk($('.swal2-cancel').hasClass('btn-warning'))
})

QUnit.test('cancel button', function (assert) {
  const done = assert.async()

  swal('Cancel me').then(
    function () {},
    function (dismiss) {
      assert.equal(dismiss, 'cancel')
      done()
    }
  ).catch(swal.noop)

  swal.clickCancel()
})

QUnit.test('esc key', function (assert) {
  const done = assert.async()

  swal('Esc me').then(
    function () {},
    function (dismiss) {
      assert.equal(dismiss, 'esc')
      done()
    }
  )

  $(document).trigger($.Event('keydown', {
    keyCode: 27
  }))
})

QUnit.test('overlay click', function (assert) {
  const done = assert.async()

  swal('Overlay click').then(
    function () {},
    function (dismiss) {
      assert.equal(dismiss, 'overlay')
      done()
    }
  )

  $('.swal2-container').click()
})

QUnit.test('timer works', function (assert) {
  const done = assert.async()

  swal({title: 'Timer test', timer: 10, animation: false}).then(
    function () {},
    function (dismiss) {
      assert.equal(dismiss, 'timer')
      done()
    }
  )
})

QUnit.test('close button', function (assert) {
  const done = assert.async()

  swal({title: 'Close button test', showCloseButton: true}).then(
    function () {},
    function (dismiss) {
      assert.equal(dismiss, 'close')
      done()
    }
  )

  const $closeButton = $('.swal2-close')
  assert.ok($closeButton.is(':visible'))
  $closeButton.click()
})

QUnit.test('jQuery/js element as html param', function (assert) {
  swal({
    html: $('<p>jQuery element</p>')
  })
  assert.equal($('.swal2-content').html(), '<p>jQuery element</p>')

  const p = document.createElement('p')
  p.textContent = 'js element'
  swal({
    html: p
  })
  assert.equal($('.swal2-content').html(), '<p>js element</p>')
})

QUnit.test('set and reset defaults', function (assert) {
  swal.setDefaults({confirmButtonText: 'Next >', showCancelButton: true})
  swal('Modal with changed defaults')
  assert.equal($('.swal2-confirm').text(), 'Next >')
  assert.ok($('.swal2-cancel').is(':visible'))

  swal.resetDefaults()
  swal('Modal after resetting defaults').catch(swal.noop)
  assert.equal($('.swal2-confirm').text(), 'OK')
  assert.ok($('.swal2-cancel').is(':hidden'))

  swal.clickCancel()
})

QUnit.test('input text', function (assert) {
  const done = assert.async()

  const string = 'Live for yourself'
  swal({input: 'text'}).then(function (result) {
    assert.equal(result, string)
    done()
  })

  $('.swal2-input').val(string)
  swal.clickConfirm()
})

QUnit.test('validation error', function (assert) {
  const done = assert.async()

  swal({input: 'email', animation: false})
  assert.ok($('.swal2-validationerror').is(':hidden'))
  setTimeout(function () {
    const initialModalHeight = $('.swal2-modal').outerHeight()

    swal.clickConfirm()
    setTimeout(function () {
      assert.ok($('.swal2-validationerror').is(':visible'))
      assert.ok($('.swal2-modal').outerHeight() > initialModalHeight)

      $('.swal2-input').val('blah-blah').trigger('input')
      assert.ok($('.swal2-validationerror').is(':hidden'))
      assert.ok($('.swal2-modal').outerHeight() === initialModalHeight)
      done()
    })
  }, 60)
})

QUnit.test('input select', function (assert) {
  const done = assert.async()

  const selected = 'dos'
  swal({ input: 'select', inputOptions: {uno: 1, dos: 2} }).then(function (result) {
    assert.equal(result, selected)
    done()
  })

  $('.swal2-select').val(selected)
  swal.clickConfirm()
})

QUnit.test('input checkbox', function (assert) {
  const done = assert.async()
  const checkbox = $('.swal2-checkbox input')

  swal({input: 'checkbox', inputAttributes: {name: 'test-checkbox'}}).then(function (result) {
    assert.equal(checkbox.attr('name'), 'test-checkbox')
    assert.equal(result, '1')
    done()
  })

  checkbox.prop('checked', true)
  swal.clickConfirm()
})

QUnit.test('input range', function (assert) {
  swal({ input: 'range', inputAttributes: {min: 1, max: 10}, inputValue: 5 })
  const input = $('.swal2-range input')
  assert.equal(input.attr('min'), '1')
  assert.equal(input.attr('max'), '10')
  assert.equal(input.val(), '5')
})

QUnit.test('queue', function (assert) {
  const done = assert.async()
  const steps = ['Step 1', 'Step 2']

  assert.equal(swal.getQueueStep(), null)

  swal.setDefaults({animation: false})
  swal.queue(steps).then(function () {
    swal('All done!')
  })

  assert.equal($('.swal2-modal h2').text(), 'Step 1')
  assert.equal(swal.getQueueStep(), 0)
  swal.clickConfirm()

  setTimeout(function () {
    assert.equal($('.swal2-modal h2').text(), 'Step 2')
    assert.equal(swal.getQueueStep(), 1)
    swal.clickConfirm()

    setTimeout(function () {
      assert.equal($('.swal2-modal h2').text(), 'All done!')
      assert.equal(swal.getQueueStep(), null)
      swal.clickConfirm()

      // test queue is cancelled on first step, other steps shouldn't be shown
      swal.queue(steps).catch(swal.noop)
      swal.clickCancel()
      assert.notOk(swal.isVisible())
      done()
    })
  })
})

QUnit.test('dymanic queue', function (assert) {
  const done = assert.async()
  const steps = [
    {
      title: 'Step 1',
      preConfirm: function () {
        return new Promise(function (resolve) {
          // insert to the end by default
          swal.insertQueueStep('Step 3')
          // step to be deleted
          swal.insertQueueStep('Step to be deleted')
          // insert with positioning
          swal.insertQueueStep({
            title: 'Step 2',
            preConfirm: function () {
              return new Promise(function (resolve) {
                swal.deleteQueueStep(3)
                resolve()
              })
            }
          }, 1)
          resolve()
        })
      }
    }
  ]

  swal.setDefaults({animation: false})
  swal.queue(steps).then(function () {
    swal('All done!')
  })

  assert.equal($('.swal2-modal h2').text(), 'Step 1')
  swal.clickConfirm()

  setTimeout(function () {
    assert.equal($('.swal2-modal h2').text(), 'Step 2')
    assert.equal(swal.getQueueStep(), 1)
    swal.clickConfirm()

    setTimeout(function () {
      assert.equal($('.swal2-modal h2').text(), 'Step 3')
      assert.equal(swal.getQueueStep(), 2)
      swal.clickConfirm()

      setTimeout(function () {
        assert.equal($('.swal2-modal h2').text(), 'All done!')
        assert.equal(swal.getQueueStep(), null)
        swal.clickConfirm()
        done()
      })
    })
  })
})

QUnit.test('showLoading and hideLoading', function (assert) {
  swal({
    title: 'test loading state',
    showCancelButton: true
  })

  swal.showLoading()
  assert.ok($('.swal2-confirm').hasClass('swal2-loading'))
  assert.ok($('.swal2-cancel').is(':disabled'))

  swal.hideLoading()
  assert.notOk($('.swal2-confirm').hasClass('swal2-loading'))
  assert.notOk($('.swal2-cancel').is(':disabled'))

  swal({
    title: 'test loading state',
    showConfirmButton: false
  })

  swal.showLoading()
  assert.ok($('.swal2-confirm').is(':visible'))
  assert.ok($('.swal2-confirm').hasClass('swal2-loading'))

  swal.hideLoading()
  assert.notOk($('.swal2-confirm').is(':visible'))
  assert.notOk($('.swal2-confirm').hasClass('swal2-loading'))
})

QUnit.test('disable/enable buttons', function (assert) {
  swal('test disable/enable buttons')

  swal.disableButtons()
  assert.ok($('.swal2-confirm').is(':disabled'))
  assert.ok($('.swal2-cancel').is(':disabled'))

  swal.enableButtons()
  assert.notOk($('.swal2-confirm').is(':disabled'))
  assert.notOk($('.swal2-cancel').is(':disabled'))

  swal.disableConfirmButton()
  assert.ok($('.swal2-confirm').is(':disabled'))

  swal.enableConfirmButton()
  assert.notOk($('.swal2-confirm').is(':disabled'))
})

QUnit.test('input radio', function (assert) {
  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  assert.equal($('.swal2-radio label').length, 2)
  assert.equal($('.swal2-radio input[type="radio"]').length, 2)
})

QUnit.test('disable/enable input', function (assert) {
  swal({
    input: 'text'
  })

  swal.disableInput()
  assert.ok($('.swal2-input').is(':disabled'))
  swal.enableInput()
  assert.notOk($('.swal2-input').is(':disabled'))

  swal({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  swal.disableInput()
  $('.swal2-radio radio').each(function (radio) {
    assert.ok(radio.is(':disabled'))
  })
  swal.enableInput()
  $('.swal2-radio radio').each(function (radio) {
    assert.notOk(radio.is(':disabled'))
  })
})

QUnit.test('default focus', function (assert) {
  const done = assert.async()

  swal('Modal with the Confirm button only')
  assert.ok(document.activeElement === $('.swal2-confirm')[0])

  swal({
    text: 'Modal with two buttons',
    showCancelButton: true
  })
  assert.ok(document.activeElement === $('.swal2-confirm')[0])

  swal({
    text: 'Modal with an input',
    input: 'text'
  })
  setTimeout(function () {
    assert.ok(document.activeElement === $('.swal2-input')[0])
    done()
  })
})

QUnit.test('reversed buttons', function (assert) {
  swal({
    text: 'Modal with reversed buttons',
    reverseButtons: true
  })
  assert.ok($('.swal2-confirm').index() - $('.swal2-cancel').index() === 1)

  swal('Modal with buttons')
  assert.ok($('.swal2-cancel').index() - $('.swal2-confirm').index() === 1)
})

QUnit.test('focus cancel', function (assert) {
  swal({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  })
  assert.ok(document.activeElement === $('.swal2-cancel')[0])
})

QUnit.test('image custom class', function (assert) {
  swal({
    text: 'Custom class is set',
    imageUrl: 'image.png',
    imageClass: 'image-custom-class'
  })
  assert.ok($('.swal2-image').hasClass('image-custom-class'))

  swal({
    text: 'Custom class isn\'t set',
    imageUrl: 'image.png'
  })
  assert.notOk($('.swal2-image').hasClass('image-custom-class'))
})

QUnit.test('modal vertical offset', function (assert) {
  const done = assert.async(1)
  // create a modal with dynamic-height content
  swal({
    imageUrl: '../assets/vs_icon.png',
    title: 'Title',
    html: '<hr><div style="height: 50px"></div><p>Text content</p>',
    type: 'warning',
    input: 'text',
    animation: false
  })

  // if we can't load local images, load an external one instead
  $('.swal2-image').on('error', function () {
    this.src = 'https://unsplash.it/150/50?random'
  })

  // listen for image load
  $('.swal2-image').on('load', function () {
    const box = $('.swal2-modal')[0].getBoundingClientRect()
    const delta = box.top - (box.bottom - box.height)
    // allow 1px difference, in case of uneven height
    assert.ok(Math.abs(delta) <= 1)
    done()
  })
})
