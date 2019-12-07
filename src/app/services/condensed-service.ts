import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { TreeNode } from 'angular-tree-component';

import * as _ from 'lodash';
@Injectable()

export class condensedService {

    removeNode(node: TreeNode) {
        let parentNode = node.realParent
            ? node.realParent
            : node.treeModel.virtualRoot;
        _.remove(parentNode.data.children, function (child) {
            return child === node.data;
        });
    }

    removePrivateNode(node: TreeNode) {
        let parentNode = node.realParent
            ? node.realParent
            : node.treeModel.virtualRoot;
        _.remove(parentNode.data.children, function (child) {
            return child === node.data;
        });
    }

}