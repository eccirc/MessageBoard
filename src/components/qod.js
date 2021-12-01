import React, { useState, useEffect } from "react"

async function getQuotes() {
    //Get a quote of the day from the quotes API!
    let qurl = "https://quotes.rest/qod?category=inspire"
    let response = await fetch(qurl,
        {
            method: "GET",
            headers: { "accept": "application/json" }
        }
    )
    return response.json()
}
const Qod = () => {
    const [quote, setQuote] = useState({})

    const loadQuote = async () => {
        let result = await getQuotes()
        setQuote(result)
    }

    useEffect(() => {
        loadQuote()

    }, [])

    return (
        <div>
            {quote.contents &&
                <div>
                    <p className="pt-4" >{quote.contents.quotes[0].quote}</p>
                    <p className="pt-2 text-sm text-gray-500 ">{quote.contents.quotes[0].author}</p>
                </div>
            }
            <span className="flex text-gray-500 text-xs pt-2" >
                <img src="https://theysaidso.com/branding/theysaidso.png" height="20" width="20" alt="theysaidso.com" />
                <a href="https://theysaidso.com" title="Powered by quotes from theysaidso.com">
                    They Said So®
                </a>
            </span>
        </div>
    )


}

export default Qod