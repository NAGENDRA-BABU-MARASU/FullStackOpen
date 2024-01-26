import React from 'react'

export default function Search({searchWord, handleSearchWord}) {
  return (
    <div>
      find countries <input value={searchWord} onChange={handleSearchWord} />
    </div>
  )
}
