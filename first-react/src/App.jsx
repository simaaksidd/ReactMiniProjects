import Entry from "./components/Entry";
import Header from "./components/Header";
import data from './data.js'

export default function App() {
  const rawData = data
  const entryContent = rawData.map((entry) => {
    return (
      <Entry 
        key={entry.id}
        {...entry}
      />
    )
  })
  
  return (
    <>
      <Header></Header>
      <main className="container">
        {entryContent}
      </main>  
    </> 
  )
}