import _ from 'web3'

function Web37(){
  const test = (obj) =>{
    console.log(obj)
    return this
  }
}

Web37.prototype.setProvider = (a,b)=> {
  console.log(a+b)
};

export default Web37 