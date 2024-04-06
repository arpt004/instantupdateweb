'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import classes from './body.module.css';
import NewsList from './newsList/newsList';
import Notes from './notes/notes';
import Loader from '../common/Loader/loader';
import Message from '../common/Message/message';


export default function Body() {

    const [news, setNews] = useState([]);
    const [newsCategory, setNewsCategory] = useState([]);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState(false);
    const [messageData, setMessageData] = useState({});

    const searchParams = useSearchParams()
    const paraCategory = searchParams.get('category');

    function formatCategoryData(news, category) {
        setNewsCategory(category)
        const categoryArray = ['business', 'politics', 'sports', 'technology', 'world', 'market']
        if(category && categoryArray.includes(category)) {
            const filterData = news.filter((eachNews) => eachNews.category.toLowerCase() === category);
            setNews(filterData)
        } else{
            setNews(news)
        }
    }

    async function fetchNewsData() {
        setLoader(true)

        try{
            const response = await fetch( `/api/fetchAll`, { next: { tags: ['newsdata'] } } );
            // const response = await fetch( `/api/fetchAll`, { next: { revalidate: 2 } } );
            // const response = await fetch( `/api/fetchAll`, { cache: 'no-store' } );
            // const response = await fetch( `/api/fetchAll`, { cache: 'force-cache'} );
            // const response = await fetch( `/api/fetchAll`);

            if(response.ok) {
                const res = await response.json();
                // setNews(res)
                formatCategoryData(res, paraCategory)
                setLoader(false)
            }
        }catch(error) {
            console.log(error);
            setLoader(false);
        }
    }

    useEffect(() => {
        fetchNewsData();
    }, [paraCategory])


    if(loader){
        return <Loader />
    }

    return(
        <div className={classes.container}> 
            <Notes />
            <NewsList newsData={news} setNews={setNews} setMessage={setMessage} setMessageData={setMessageData} />

            { message && <Message type={messageData.type} message={messageData.message} onClose={() => setMessage(false)}/>}

        </div>
    )
}