import React, { useState, useEffect } from 'react';
import TabList from './components/TabList';
import TabForm from './components/TabForm';

function App() {
  const [mySites, setMySites] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputComment, setInputComment] = useState('');

  useEffect(() => {
    const storage = chrome?.storage?.local;
    // const storage = chrome?.storage?.local || browser?.storage?.local;

    if (!storage) {
      console.error('WebExtensions storage API not supported');
      return;
    }

    storage.get('mySites', (result) => {
      const sitesFromStorage = result.mySites;
      if (sitesFromStorage) {
        setMySites((prevSites) => [...prevSites, ...sitesFromStorage]);
      }
    });
  }, []);

  const saveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const newSite = {
        title: inputTitle || tabs[0].title,
        comment: inputComment,
        url: tabs[0].url,
        uuid: self.crypto.randomUUID(),
      };

      const updatedSites = [...mySites, newSite];
      setMySites(updatedSites);

      const storage = chrome?.storage?.local || browser?.storage?.local;
      if (storage) {
        storage.set({ mySites: updatedSites });
      }

      setInputTitle('');
      setInputComment('');
    });
  };

  const deleteSite = (uuid) => {
    const updatedSites = mySites.filter((site) => site.uuid !== uuid);

    setMySites(updatedSites);

    const storage = chrome?.storage?.local || browser?.storage?.local;
    if (storage) {
      storage.set({ mySites: updatedSites });
    }
  };

  return (
    <div className='h-screen w-screen bg-[#F2F2F2]'>
      <div className='p-5 w-screen overflowx-hidden m-auto bg-[#F2F2F2]'>
        <TabForm
          inputTitle={inputTitle}
          inputComment={inputComment}
          setInputTitle={setInputTitle}
          setInputComment={setInputComment}
          saveTab={saveTab}
        />
        <TabList
          mySites={mySites}
          deleteSite={deleteSite}
        />
      </div>
    </div>
  );
}

export default App;
