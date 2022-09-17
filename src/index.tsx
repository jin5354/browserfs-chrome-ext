import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './index.scss';

declare var chrome: any

const Panel = () => {
  const [instance, setInstance] = useState(null)

  useEffect(() => {
    chrome.devtools.inspectedWindow.eval('window.BrowserFS', undefined, (browserfs: any) => {
      console.log('browserfs:', browserfs)

      if(browserfs) {
        setInstance(browserfs)
      }
    })
  }, [])

  return (
    <div className="extension-container">
      {instance ? [<div className="trees">trees</div>] : <div>未找到 BrowserFS 实例</div>}
    </div>
  );
};

render(<Panel />, window.document.getElementById('app'))

