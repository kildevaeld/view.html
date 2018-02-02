import { withBindings } from '../index';
import { View, Constructor } from 'view';
import { Model, withModel, IModelView } from 'view.data';

class Data extends Model {

}

export class MainView extends withBindings<Constructor<View & IModelView<Data>>, Data>(withModel(View)) {

}