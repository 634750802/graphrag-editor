import EventEmitter from 'eventemitter3';

export type IdType = string | number;

export interface NetworkNode {
  id: IdType;
}

export interface NetworkLink {
  id: IdType;
  source: IdType;
  target: IdType;
}

export interface BaseNetworkOptions {
  noDirection: boolean;
}

export interface ReadonlyNetwork<Node extends NetworkNode, Link extends NetworkLink> extends EventEmitter<NetworkEvents> {
  node (id: IdType): Node | undefined;

  link (id: IdType): Link | undefined;

  nodes (): Node[];

  links (): Link[];

  nodeNeighborhoods (id: IdType): Set<IdType> | null;
}

export interface Network<Node extends NetworkNode, Link extends NetworkLink> extends ReadonlyNetwork<any, any> {
  addNode (node: Node): void;

  removeNode (nodeId: IdType): void;

  addLink (link: Link): void;

  removeLink (linkId: IdType): void;
}

export interface NetworkEvents {
  'update:node': [id: IdType];
  'update:link': [id: IdType];
}

export abstract class BaseNetworkView<Node extends NetworkNode, Link extends NetworkLink> extends EventEmitter<NetworkEvents> implements ReadonlyNetwork<Node, Link> {
  abstract link (id: IdType): Link | undefined

  abstract links (): Link[]

  abstract node (id: IdType): Node | undefined

  abstract nodes (): Node[]

  abstract nodeNeighborhoods (id: IdType): Set<IdType> | null;
}

export class BaseNetwork<Node extends NetworkNode, Link extends NetworkLink> extends BaseNetworkView<Node, Link> implements Network<Node, Link> {
  private _nodes: Node[] = [];
  private _links: Link[] = [];

  private _nodesMap: Map<IdType, Node> = new Map();
  private _linksMap: Map<IdType, Link> = new Map();

  private _sourceRelMap: Map<IdType, Set<IdType>> = new Map();
  private _targetRelMap: Map<IdType, Set<IdType>> = new Map();

  readonly noDirection: boolean;

  constructor ({
    noDirection = true,
  }: Partial<BaseNetworkOptions> = {}) {
    super();
    this.noDirection = noDirection;
    if (noDirection) {
      this._sourceRelMap = this._targetRelMap;
    }
  }

  node (nodeId: IdType) {
    return this._nodesMap.get(nodeId);
  }

  addNode (node: Node): void {
    this._nodes.push(node);
    this._nodesMap.set(node.id, node);
  }

  removeNode (nodeId: IdType) {
    if (!this._nodesMap.has(nodeId)) {
      return;
    }

    // remove links
    const sourceLink = this._sourceRelMap.get(nodeId);
    if (sourceLink) {
      sourceLink.forEach(id => {
        this.removeLink(id);
      });
    }
    if (!this.noDirection) {
      const targetLink = this._targetRelMap.get(nodeId);
      if (targetLink) {
        targetLink.forEach(id => {
          this.removeLink(id);
        });
      }
    }

    this._nodesMap.delete(nodeId);
    const idx = this._nodes.findIndex(node => node.id === node.id);
    if (idx >= 0) {
      this._nodes.splice(idx, 1);
    }
  }

  link (nodeId: IdType) {
    return this._linksMap.get(nodeId);
  }

  addLink (link: Link): void {
    this._links.push(link);
    this._linksMap.set(link.id, link);

    let set = this._sourceRelMap.get(link.source);
    if (!set) {
      set = new Set();
    }
    this._sourceRelMap.set(link.source, set);
    set.add(link.target);

    if (!this.noDirection) {
      let set = this._targetRelMap.get(link.target);
      if (!set) {
        set = new Set();
      }
      this._targetRelMap.set(link.target, set);
      set.add(link.source);
    }
  }

  removeLink (linkId: IdType): void {
    const link = this._linksMap.get(linkId);
    if (!link) {
      return;
    }

    this._linksMap.delete(linkId);
    const idx = this._links.findIndex(link => link.id === link.id);
    if (idx >= 0) {
      this._links.splice(idx, 1);
    }
  }

  nodes () {
    return this._nodes;
  }

  links () {
    return this._links;
  }

  nodeNeighborhoods (id: IdType): Set<IdType> | null {
    if (!this._nodesMap.has(id)) {
      return null;
    }
    const set = new Set<IdType>();
    this._sourceRelMap.get(id)?.forEach(id => set.add(id));
    this._targetRelMap.get(id)?.forEach(id => set.add(id));
    return set;
  }

  replaceNodeAttrs (id: IdType, partial: Omit<Node, 'id'>) {
    if ('id' in partial) {
      throw new Error('cannot replace node id');
    }
    const node = this.node(id);
    if (node) {
      Object.assign(node, partial);
      this.emit('update:node', id);
    } else {
      throw new Error(`node ${id} not found in network`);
    }
  }

  replaceLinkAttrs (id: IdType, partial: Omit<Link, 'id' | 'source' | 'target'>) {
    if ('id' in partial) {
      throw new Error('cannot replace link id');
    }
    if ('source' in partial || 'target' in partial) {
      throw new Error('cannot replace link source or target');
    }
    const link = this.link(id);
    if (link) {
      Object.assign(link, partial);
      this.emit('update:link', id);
    } else {
      throw new Error(`link ${id} not found in network`);
    }
  }
}
