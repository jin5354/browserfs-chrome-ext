import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Tree } from 'antd';
import "antd/dist/antd.css";
import './index.scss';

declare var chrome: any

const initTreeData = [
  { title: '/', key: '/', isLeaf: false },
];

const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
  list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

const Panel = () => {
  const [instance, setInstance] = useState(null)
  const [treeData, setTreeData] = useState(initTreeData)
  const [fileContent, setFileContent] = useState('')

  useEffect(() => {
    chrome.devtools.inspectedWindow.eval('window.BrowserFS', undefined, (browserfs: any) => {
      if(browserfs) {
        setInstance(browserfs)
      }
    })
  }, [])

  const onLoadData = useCallback(({ key, children }: any) =>
  new Promise<void>(resolve => {
    if (children) {
      resolve();
      return;
    }

    const evalStr = `(() => {
      let key = '${key}'
      let fs = window.BrowserFS.BFSRequire('fs')
      let path = window.BrowserFS.BFSRequire('path')

      let result = []
      fs.readdirSync(key).forEach((file) => {
        const curPath = path.join(key, file)
        if (fs.statSync(curPath).isDirectory()) {
          result.push({
            title: path.basename(curPath), key: curPath
          })
        } else {
          result.push({
            title: path.basename(curPath), key: curPath, isLeaf: true
          })
        }
      });

      return result

    })()
    `

    chrome.devtools.inspectedWindow.eval(evalStr, undefined, (result: any) => {

      setTreeData(origin =>
        updateTreeData(origin, key, result),
      );

      resolve()
    })
  }), [instance])

  const selectHandler = useCallback((params: any) => {
    if(params.length) {
      const targetPath = params[0]

      const evalStr = `(() => {
        let targetPath = '${targetPath}'
        let fs = window.BrowserFS.BFSRequire('fs')

        return fs.readFileSync(targetPath, 'utf-8')
      })()
      `

      chrome.devtools.inspectedWindow.eval(evalStr, undefined, (content: any) => {
        setFileContent(content)
      })
    }
  }, [instance])

  const refreshHandler = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <div className="extension-container">
      {instance ? [
      <div className="title"><button onClick={refreshHandler}>Refresh</button></div>,
      <div className="wrap">
        <div className="tree">
          <Tree loadData={onLoadData} selectable onSelect={selectHandler} treeData={treeData} />
        </div>
        <div className="content">
          <pre>{fileContent}</pre>
        </div>
      </div>] : <div>未找到 BrowserFS 实例</div>}
    </div>
  );
};

render(<Panel />, window.document.getElementById('app'))

