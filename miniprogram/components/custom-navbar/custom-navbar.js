Component({
  properties: { showBack: { type: Boolean, value: false }, title: { type: String, value: '' } },
  methods: { onBack() { this.triggerEvent('back') } }
})
