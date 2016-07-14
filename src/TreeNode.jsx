import React, { PropTypes } from 'react'
import classnames from 'classnames'

import { prefix } from './utils'

const noop = () => {};

class TreeNode extends React.Component {

  constructor(props) {
    super(props);

    [
      'onExpand',
      'onSelect',
      'onCheck'
    ].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { multiple, commbox, checked, selected, expanded, children } = this.props
    // 节点在check时，会有关联操作，可能它的children也发生了变化，这里需要判断
    return children !== nextProps.children || checked !== nextProps.checked || selected !== nextProps.selected || expanded !== nextProps.expanded
  }

  render() {
    const props = this.props
    const { value, text, selected, multiple, commbox, checked, expanded, qtip, className, children } = props
    const prefixCls = prefix(props)
    const classes = {
      [prefixCls]: true,
      // 展开节点后的样式
      [prefix(props, 'expanded')]: expanded,
      // 没有commbox时，选中行的样式
      [prefix(props, 'selected')]: !commbox && selected,
      [prefix(props, 'checked')]: checked
    }
  	
    return (
    	<li id={value} className={classnames(className, classes)}>
        {/** 叶节点，只添加空白的占位元素，用于文本对齐 **/}
        {this.isLeaf() ? <i /> : <i className="icon-arrow" onClick={this.onExpand}/>}
        {/** 添加commbox **/}
        {this.renderCommbox()}
        <a onClick={this.onSelect} onDoubleClick={this.onExpand} title={qtip || text}>{text}</a>
        {children}
      </li>     
    );
  }

  renderCommbox() {
    const { multiple, commbox, checked } = this.props
    if (!commbox) {
      return null
    }

    const commboxPrefixCls = multiple ? 'icon-checkbox' : 'icon-radio'
    const commboxCls = `${commboxPrefixCls}-${checked}`

    return (
        <i className={commboxCls} onClick={this.onCheck} />
      )
  }

  isLeaf() {
    const { leaf, children } = this.props
    return leaf || !children
  }

  /**
   * 渲染子节点
   */
  renderChildren() {
    const { tree, path, expanded, children } = this.props
    if (!tree || !children || !expanded) {
      return null
    }

    return (
        <ul>
          {React.Children.map(children, (child, index) => {
            return tree.renderTreeNode(child, index, this, path)
          }, tree)}
        </ul>
      )
  }

  onExpand() {
    // console.log('onExpand', this)
    const { expanded, onExpand } = this.props
    onExpand(expanded === 1 ? 0 : 1, this)
  }

  onSelect() {
    // console.log('onSelect', this)
    const { commbox, selected, onSelect } = this.props

    // 存在commbox时，不触发其onSelect事件
    if (!commbox) {
      onSelect(selected === 1 ? 0 : 1, this)
    }
    
  }

  onCheck() {
    const { checked, onCheck } = this.props
    // 选中状态，点击后，设为未选中状态，而半选或未选中状态在点击后，都将设为选中状态
    onCheck(checked === 1 ? 0 : 1, this)
  }
}

TreeNode.propTypes = {
  /**
   * 用于渲染节点的数据（这里没有把它展开，每个属性作为组件的属性来处理，是因为data中可能包含有业务数据，可能在外面会用到）
   * {
   *   id: string,
   *   pid: string,
   *   text: string,
   *   selected: bool,
   *   expanded: bool,
   *   disabled: bool,
   *   leaf: bool,
   *   qtip: string, // 节点的提示信息
   *   href: string,
   *   hrefTarget: string
   * }
   * @type {[object]}
   */
  data: PropTypes.object,
  /**
   * 节点value(ID)
   */
  value: PropTypes.string.isRequired,
  /**
   * 节点显示的文本信息
   */
  text: PropTypes.string.isRequired,
  /**
   * 节点的提示信息
   */
  qtip: PropTypes.string,
  /**
   * 是否选中
   */
  selected: PropTypes.number,
  /**
   * 是否选中checkbox（仅在commbox=true时有效）
   * 其中0为未选中，1为选中，2为半选中
   */
  checked: PropTypes.number,
  /**
   * 是否多选
   * @type {[type]}
   */
  multiple: PropTypes.bool,
  /**
   * 是否展开
   */
  expanded: PropTypes.number,
  /**
   * 是否设为disable，让它不可选
   */
  disabled: PropTypes.bool,
  /**
   * 是否为叶节点
   */
  leaf: PropTypes.bool,
  /**
   * 是否显示复选框（多选模式）
   */
  commbox: PropTypes.bool,
  /**
   * 单击节点（文本）时，是否展开节点
   */
  clickExpand: PropTypes.bool,
  /**
   * 选取节点时的回调事件
   * @type {[function(isSelected, node)]}
   */
  onSelect: PropTypes.func,
  /**
   * 选取节点时的回调事件
   * @type {[function(isChecked, node)]}
   */
  onCheck: PropTypes.func,
  /**
   * 展开节点时的回调事件
   */
  onExpand: PropTypes.func
}

TreeNode.defaultProps = {
  prefixCls: 'rc-tree-node',
  onSelect: noop,
  onCheck: noop,
  onExpand: noop
}

export default TreeNode;