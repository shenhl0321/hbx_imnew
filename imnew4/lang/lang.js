import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
import _data from '../common/_data';
import zh from './zh'
import en from './en'
import th from './th'
import pty from './pty'
let locale = _data.localData('lang') || '';
if (locale == '') {
	locale = 'zh';
	_data.localData('lang', locale)
}
console.log(locale)
const i18n = new VueI18n({
	locale: locale,
	messages: {
		zh: zh,
		en: en,
		th: th,
		pty: pty
	}
})
export default i18n