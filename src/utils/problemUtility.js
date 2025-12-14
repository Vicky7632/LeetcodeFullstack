const axios = require('axios');
const getLanguageById=(lang)=>{
  const language={
   "c++": 52,
   "cpp": 52,
   "java": 62,
   "javascript": 63,
   "js": 63
  }
  return language[lang.toLowerCase()];
}
const submitBatch=async (submissions)=>{
    // taking batch submission code from judge0
   const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '9dce2213a1msh346d89915c14e30p1f1132jsnae71f3138da1',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}
const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const submitToken=async(resultToken)=>{
    const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '9dce2213a1msh346d89915c14e30p1f1132jsnae71f3138da1',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
while(true){
const result= await fetchData();
const IsResultObtained=result.submissions.every((r)=>r.status_id>2);
if(IsResultObtained)
    return result.submissions;
 await waiting(1500);
}
}
module.exports={getLanguageById,submitBatch,submitToken}

