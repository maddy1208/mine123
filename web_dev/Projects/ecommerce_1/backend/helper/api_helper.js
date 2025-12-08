class APIhelper{
    constructor(query,querystrings){
        this.query=query;
        this.querystrings=querystrings;
    }

     search(){ 
        const keywords_for_mongo=this.querystrings.keyword?
        {name: {$regex:this.querystrings.keyword,$options: "i"}}
        
        
        :{}
        console.log("query",this.query.getQuery())
        this.query=this.query.find({...keywords_for_mongo})
        return this;


    }

    filter(){
        const all_query={...this.querystrings}
        const removestrings=["page","keyword","sort",""]
        removestrings.forEach((ele)=>delete all_query[ele])
        this.query=this.query.find({...all_query})
        return this;

    }

    pagination(rpp){
        const resultsperpage=rpp;
        console.log("page",this.querystrings)
        const skip=(resultsperpage*Number(this.querystrings.page||1))-1  //1*5  -1
    
        this.query=this.query.limit(resultsperpage).skip(skip)
        console.log("pagination",this.query.getQuery())
        return this;
    }
}


export {APIhelper}