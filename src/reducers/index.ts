import { IFilesStore } from '../configureStore';
import dataSourceManager from '../dataSources/DataSourceManager';

const reducers = {
    'GET_ITEMS': getItems,
    'UPDATE_ITEMS': updateItems
};

function getItems(state: IFilesStore, parentKey?: string) {
    /* dataSourceManager.open(parentKey || '',
        (items: any[]) => {
            return updateItems(state, items);
        }
    );
    return {
        ...state,
        isLoading: true
    }; */
    return function (dispatch) {
        dataSourceManager.open(parentKey || '',
            (items: any[]) => {
                dispatch({
                    type: 'UPDATE_ITEMS',
                    data: items
                })
            }
        );
    }
}

function updateItems(state: IFilesStore, items: any[]): IFilesStore {
    let breadcrumbs = [
        {
            key: 'root',
            text: items[0].text
        }
    ];
    return {
        ...state,
        isLoading: false,
        items: items,
        breadcrumbs: breadcrumbs
    };
}

export default reducers;