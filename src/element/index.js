import {
    Dialog,
    Autocomplete,
    Input,
    InputNumber,
    Select,
    Option,
    OptionGroup,
    Button,
    Table,
    TableColumn,
    Tooltip,
    Form,
    FormItem,
    Icon,
    Row,
    Col,
    Spinner,
    Loading,
    MessageBox,
    Notification,
    Tag
} from 'element-ui'
const element = {
    install: function (Vue) {
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(OptionGroup)
        Vue.use(Input)
        Vue.use(Dialog)
        Vue.use(Row)
        Vue.use(Col)

        Vue.use(Autocomplete)
        Vue.use(InputNumber)
        Vue.use(Button)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Tooltip)
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Icon)
        Vue.use(Spinner)
        Vue.use(Tag)

        Vue.prototype.$loading = Loading.service;
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.prototype.$notify = Notification;
    }
}
export default element;