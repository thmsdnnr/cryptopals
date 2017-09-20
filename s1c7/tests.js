var expect = chai.expect;

//TODO test suite for aesDecrypt and aesEncrypt, Decrypt(Encrypt) should yield starting pt
//Encrypt(Decrypt) should result in same encrypt starting pt
//Decrypt(Encrypt)(Decrypt) should result in starting pt etc.
//seems to work with text, doesn't treat text the same way all the time necessarily, maybe need to convert it all to texst or
//only to accept hex?


  describe("padToN", () => {
    it("returns null for an empty argument", () => {
      var res=padToN();
      expect(res).to.equal(null);
    });
    it("returns null for a pad-to number less than string length e.g., padToN('ABCD',3)", () => {
      var res=padToN('ABCD',3);
      expect(res).to.equal(null);
    });
    it("returns string with no padding if string.length=n", () => {
      var res=padToN('ABCD',4);
      expect(res).to.equal('ABCD');
    });
    it("pads a string to a final length of n", () => {
      var res=padToN('ABCD',7);
      expect(res.length).to.equal(7);
    });
    it("pads using # of missing bytes as padding character (PKCS7)", () => {
      var res=padToN('ABCD',7);
      var pads=res.slice(4,7);
      expect(pads).to.equal('333');
    })
  })
  let vI=atob(`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`);


  //TODO: the decryption payoff

  describe("aesDecrypt", () => { //TODO MORE
    it ("returns null for empty input of number of bytes", () => {
      let iM='YELLOW SUBMARINE'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      let cC=hexChunk(vI);
      let cP=aesEncrypt(aesDecrypt(cC,iM,16),iM,16);
      console.log(btoa(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join("")));
      console.log(cP);
    });
  });

  describe("aesEncrypt", () => { //TODO MORE
    it ("returns null for empty input of number of bytes", () => {
      let pT='Put yr text to be encrypted here'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      let iM='YELLOW SUBMARINE'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      console.log(pT.join(""));
      console.log(iM.join(""));
      let cP=aesEncrypt(pT,iM,16);
      console.log(btoa(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join("")));
      console.log(cP);
    });
  });

    describe("aesDecrypt", () => { //TODO MORE
      it ("returns null for empty input of number of bytes", () => {
        let iM='59454c4c4f57205355424d4152494e45'.split("");
        let cC='507574207972207465787420746f20626520656e637279707465642068657265'.split("");
        let iMG=[];
        for (var i=0;i<iM.length;i+=2) {
          iMG.push(iM.slice(i,i+2).join(""));
        }
        let cCG=[];
        for (var i=0;i<cC.length;i+=2) {
          cCG.push(cC.slice(i,i+2).join(""));
        }
        console.log(iMG,cCG);
        let cP=aesDecrypt(cCG,iMG,16);
        console.log(cP);
        console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join(""));
        //console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))));
      });
    });

    describe("aesDecrypt", () => { //TODO MORE
      it ("24 bits", () => {
        let iM='59454c4c4f57205355424d4152494e453838383838383838'.split("");
        let cC='507574207972207465787420746f20626520656e637279707465642068657265'.split("");
        let iMG=[];
        for (var i=0;i<iM.length;i+=2) {
          iMG.push(iM.slice(i,i+2).join(""));
        }
        let cCG=[];
        for (var i=0;i<cC.length;i+=2) {
          cCG.push(cC.slice(i,i+2).join(""));
        }
        console.log(iMG,cCG);
        let cP=aesDecrypt(cCG,iMG,24);
        console.log(cP);
        console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join(""));
        //console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))));
      });
    });

    describe("aesDecrypt", () => { //TODO MORE
      it ("32 bits", () => {
        let iM='59454c4c4f57205355424d4152494e4531303130313031303130313031303130'.split("");
        let cC='507574207972207465787420746f20626520656e637279707465642068657265'.split("");
        let iMG=[];
        for (var i=0;i<iM.length;i+=2) {
          iMG.push(iM.slice(i,i+2).join(""));
        }
        let cCG=[];
        for (var i=0;i<cC.length;i+=2) {
          cCG.push(cC.slice(i,i+2).join(""));
        }
        console.log(iMG,cCG);
        let cP=aesDecrypt(cCG,iMG,32);
        console.log(cP);
        console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join(""));
        //console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))));
      });
    });

    describe("aesEncrypt", () => { //TODO MORE
      it ("32 bits", () => {
        let iM='59454c4c4f57205355424d4152494e4531303130313031303130313031303130'.split("");
        let cC='B8398B8E9DB343330876FDE153D4F5C3499D22A4D23886FD879614367DF7B900'.split("");
        let iMG=[];
        for (var i=0;i<iM.length;i+=2) {
          iMG.push(iM.slice(i,i+2).join(""));
        }
        let cCG=[];
        for (var i=0;i<cC.length;i+=2) {
          cCG.push(cC.slice(i,i+2).join(""));
        }
        console.log(iMG,cCG);
        let cP=aesEncrypt(cCG,iMG,32);
        console.log(cP);
        console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join(""));
        //console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))));
      });
    });

    describe("aesDecrypt", () => { //TODO MORE
      it ("24 bits decrypt", () => {
        let iM='59454c4c4f57205355424d4152494e453838383838383838'.split("");
        let cC='d39504feb9d3b10f985b020d25dd33596a1b82a9194bc760cf76f5b5dfccc8db'.split("");
        let iMG=[];
        for (var i=0;i<iM.length;i+=2) {
          iMG.push(iM.slice(i,i+2).join(""));
        }
        let cCG=[];
        for (var i=0;i<cC.length;i+=2) {
          cCG.push(cC.slice(i,i+2).join(""));
        }
        console.log(iMG,cCG);
        let cP=aesDecrypt(cCG,iMG,24);
        console.log(cP);
        console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join(""));
        //console.log(cP.map(e=>String.fromCharCode(parseInt(e,16).toString(10))));
      });
    });


  describe("hexPad", () => { //TODO MORE
    it ("does some things", () => {
      hexPad();
    });
  });

  describe("sRow", () => { //TODO MORE
    it("does a thing", () => {
      var result=sRow();
      expect(res).to.equal(null);
    });
  });

  describe("generateExpandedKey", () => {
    it("returns null if the key.length does not equal the number of bytes", () => {
      var key=''
      var res=generateExpandedKey(key,16);
      expect(res).to.equal(null);
    });
    it("returns null if the key.length does not equal the number of bytes", () => {
      var key='YELLOW SUBMARIN'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      var res=generateExpandedKey(key,16);
      expect(res).to.equal(null);
    });
    it("returns EK of 176 bytes when given 16-bit key in 16-bit mode", () => {
      var key='YELLOW SUBMARINE'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      var res=generateExpandedKey(key,16);
      expect(res.length).to.equal(176);
    });
    it("returns EK of 208 bytes when given 24-bit key in 24-bit mode", () => {
      var key='YELLOW         SUBMARINE'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      var res=generateExpandedKey(key,24);
      expect(res.length).to.equal(208);
    });
    it("returns EK of 240 bytes when given 32-bit key in 32-bit mode", () => {
      var key='YELLOW  submarine      SUBMARINE'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
      var res=generateExpandedKey(key,32);
      console.log(res);
      expect(res.length).to.equal(240);
    });
  });

  describe("clampHex", () => {
    it("returns null for no hex value", () => {
      var res=clampHex();
      expect(res).to.equal(null);
    });
    it("returns input hex value for hex value between 00 and FF (lowest)", () => {
      var res=clampHex('00');
      expect(res).to.equal('00');
    });
    it("returns input hex value for hex value between 00 and FF (highest)", () => {
      var res=clampHex('FF');
      expect(res).to.equal('FF');
    });
    it("returns hex value%0xFF for hex value greater than FF 0xffc->0xc", () => {
      var res=clampHex('FFC');
      expect(res).to.equal('c');
    });
    it("returns hex value%0xFF for hex value greater than FF 0x111->0x12", () => {
      var res=clampHex('111');
      expect(res).to.equal('12');
    });
  });
  describe("subWord", () => {
    it("returns null for an empty array", () => {
        var res=subWord([]);
        expect(res).to.equal(null);
    });
    it("returns null for an array.length!==4", () => {
      var res=subWord(['AA','BB','CC']);
      expect(res).to.equal(null);
    });
    it("returns correct hex substitution for a word (array.length=4)", () => {
      var res=subWord(['19','19','19','19'],true);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(['d4','d4','d4','d4']));
    });
  });
  describe("rotWord", () => {
    it("returns null for empty array", () => {
      var res=rotWord([]);
      expect(res).to.equal(null);
    });
    it("returns null for array of length!==4", () => {
      var res=rotWord([1,2,3]);
      expect(res).to.equal(null);
    });
    it("rotates an array of length 4 by 1", () => {
      var res=rotWord(['AA','BB','CC','DD']);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(['BB','CC','DD','AA']));
    });
  });
  describe("Rcon", () => {
    it("returns null for an index out of bounds (low)", () => {
      var res=Rcon(-1);
      expect(res).to.equal(null);
    });
    it("returns null for an index out of bounds (high)", () => {
      var res=Rcon(15);
      expect(res).to.equal(null);
    });
    it("returns null for no index", () => {
      var res=Rcon();
      expect(res).to.equal(null);
    });
    it("returns lowest thing", () => {
      var res=Rcon(0);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(['01','00','00','00']));
    });
    it("returns highest thing", () => {
      var res=Rcon(14);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(['9A','00','00','00']));
    });
  });

describe("AES block functions", () => {
  describe("byteSub", () => {
    it("returns 'd4' when given '19' to encrypt", () => {
      var res=byteSub('19',true);
      expect(res).to.equal('d4',true);
    });
    it("returns '19' when given 'd4' to decrypt", () => {
      var res=byteSub('d4',false);
      expect(res).to.equal('19',true);
    });
  });

  describe("hexXOR", () => { //TODO more tests
    it("returns hex XOR result as hex", () => {
      var res=hexXOR('0E','0B');
    });
  });

  describe("mixColumns", () => {
    it("returns null if state is empty array", () => {
      let res=mixColumns([]);
      expect(res).to.equal(null);
    });
    it("returns null if state is not a 4x4 matrix", () => {
      let res=mixColumns([[1,2,3],[4,5,6],[7,8,9]]);
      expect(res).to.equal(null);
    });
    it("returns 4 66 81 E5 in first 4 bytes when given D4 BF 5D 30 to encrypt", () => {
      let matrix=bytesToM(['D4','BF','5D','30','01',
      '01','01','01','01','01','01','01','01',
      '01','01','01']);
      let res=mixColumns(matrix,true).slice(0,4);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(['4','66','81','e5']));
    });
    it("returns D4 BF 5D 30 in first 4 bytes when given 04 66 81 E5 to decrypt", () => {
      let matrix=bytesToM(['04','66','81','E5','01',
      '01','01','01','01','01','01','01','01',
      '01','01','01']);
      let res=mixColumns(matrix,false).slice(0,4);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(['d4','bf','5d','30']));
    });
  });

  describe("multiplyG", () => {
    it("returns same value for anything multiplied by 1 e.g., '1' x 'FF' = 'FF'", () => {
      var res=multiplyG('FF','1');
      expect(res).to.equal('FF');
    });
    it("returns zero for anything multiplied by 0 e.g., '0' x 'FF' = '00'", () => {
      var res=multiplyG('FF','0');
      expect(res).to.equal('00');
    });
    it("returns '0F' for 'AF' * '08'", () => {
      var res=multiplyG('AF','08');
      expect(res).to.equal('0F');
    });
    it("returns '27' for '0F' * 'F0'", () => {
      var res=multiplyG('0F','F0');
      expect(res).to.equal('27');
    });
  });

  describe("columnByIndex (CBI)", () => {
    it("returns null for empty matrix or empty index", () => {
      var res=CBI();
      expect(res).to.equal(null);
    });
    it("returns null for 1D matrix and index 0", () => {
      var res=CBI([1,2,3,4,5,6,7,8],0);
      expect(res).to.equal(null);
    });
    it("returns null for nested array and index out-of-bounds", () => {
      var inputArr=[[1,2,3],[4,5,6]];
      var res=CBI(inputArr,3);
      expect(res).to.equal(null);
    });
    it("returns correct column for nested array and index in-bounds", () => {
      var inputArr=[[1,2,3],[4,5,6]];
      var res=CBI(inputArr,2);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([3,6]));
    });
    it("returns correct column for nested array and index in-bounds", () => {
      var inputArr=[[1,2,3],[4,5,6]];
      var res=CBI(inputArr,0);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([1,4]));
    });
  });

  describe("rowByIndex (RBI)", () => {
    it("returns null for empty matrix or empty index", () => {
      var res=RBI();
      expect(res).to.equal(null);
    });
    it("returns null for 1-D matrix and index 0", () => {
      var inputArr=[1,2,3,4,5,6];
      var res=RBI([1,2,3,4,5,6],0);
      expect(res).to.equal(null);
    });
    it("returns null for nested array and index out-of-bounds", () => {
      var inputArr=[[1,2,3],[4,5,6]];
      var res=RBI(inputArr,2);
      expect(res).to.equal(null);
    });
    it("returns correct row for nested array and index in-bounds", () => {
      var inputArr=[[1,2,3],[4,5,6]];
      var res=RBI(inputArr,1);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([4,5,6]));
    });
  });

  describe("byteXOR", () => {
    it("should return null when either argument is not len=8", () => {
      var res=byteXOR('1100000','1100');
      expect(res).to.equal(null);
    });
    it("should return null when either argument is not binary even though len=8", () => {
      var res=byteXOR('11111111','FFCCDDAA');
      expect(res).to.equal(null);
    });
    it("should return the string '11111111' when XOR-ing '11111111' with '00000000'", () => {
      var res=byteXOR('11111111','00000000');
      expect(res).to.equal('11111111');
    });
  });

  describe("bytesToM", () => {
    it("should return null for an array that does not have length 16", () => {
      var inArr=[1,2,3,4];
      var res=bytesToM(inArr);
      expect(res).to.equal(null);
    });
    it ("should return a 4x4 nested array from an input of size 1x16", () => {
      var inArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
      var res=bytesToM(inArr);
      expect(res.length).to.equal(4);
    });
    it ("should order the first row of elements correctly", () => {
      var inArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
      var testRow=[1,5,9,13];
      var res=bytesToM(inArr);
      expect(JSON.stringify(res[0])).to.equal(JSON.stringify(testRow));
    });
    it ("should order the second row of elements correctly", () => {
      var inArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
      var testRow=[2,6,10,14];
      var res=bytesToM(inArr);
      expect(JSON.stringify(res[1])).to.equal(JSON.stringify(testRow));
    });
    it ("should order the third row of elements correctly", () => {
      var inArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
      var testRow=[3,7,11,15];
      var res=bytesToM(inArr);
      expect(JSON.stringify(res[2])).to.equal(JSON.stringify(testRow));
    });
    it ("should order the fourth row of elements correctly", () => {
      var inArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
      var testRow=[4,8,12,16];
      var res=bytesToM(inArr);
      expect(JSON.stringify(res[3])).to.equal(JSON.stringify(testRow));
    });
  });

  describe("binToHex", () => {
    it("should return correct hex value from binary", () => {
      var res=binToHex('10000000');
      expect(res).to.equal("80");
    });

    it("should return correct value from binary when number is fewer than 8 bits", () => {
      var res=binToHex('01');
      expect(res).to.equal("1");
      res=binToHex('01');
    });

    it("should convert binary 1000 to 0x10", () => {
      res=binToHex('10000');
      expect(res).to.equal("10");
    });
  });

  describe("flattenArray", () => {
    it("should return empty array normally", () => {
      var res=flattenArray([]);
      expect(res).to.be.an('array');
    });
    it("should not affect a non-nested array", () => {
      var input=[1,2,3,4,'q'];
      var res=flattenArray(input);
      expect(JSON.stringify(input)).to.equal(JSON.stringify(res));
    });
    it("should un-nest a single-level nested array", () => {
      var nested=[[1,2],3,4,'q'];
      var res=flattenArray(nested);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([1,2,3,4,'q']));
    });
    it("should un-nest multiply-nested array", () => {
      var nested=[[1,[2,3,[4,5,6,[7,8,9]]]],'q'];
      var res=flattenArray(nested);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([1,2,3,4,5,6,7,8,9,'q']));
    });
  });

  describe("decToBin", () => {
    it("should return a string of length 8", () => {
      var res=decToBin(10);
      expect(res.length).to.equal(8);
    });

    it("should return 100000000 when fed 128", () => {
      var res=decToBin(128);
      expect(res).to.equal('10000000');
    });

    it("should return NaN when given empty input", () => {
      res=binToHex();
      expect(res).to.equal("NaN");
    });
  });

  describe("textToBinary", () => {
    it("should return an array with length [numberOfCharsInString]", () => {
      var res=textToBinary('four');
      expect(res.length).to.equal(4);
    });

    it("should return padded binary numbers (8 bits each)", () => {
      var res=textToBinary('four');
      var numBits=res.reduce((a,b)=>a+b.length,0)
      expect(numBits).to.equal(32);
    });

    it("should return null when given empty input", () => {
      res=textToBinary();
      expect(res).to.equal(null);
    });
  });

  describe("hamming", () => {
    //TODO -> either string or binary input format, not both
    it("should return zero for identical strings", () => {
      var res=hamming('thesamething','thesamething');
      expect(res.length).to.equal(0);
    });

    it("should return padded binary numbers (8 bits each)", () => {
      var res=textToBinary('four');
      var numBits=res.reduce((a,b)=>a+b.length,0)
      expect(numBits).to.equal(32);
    });

    it("should return null when given empty input", () => {
      res=textToBinary();
      expect(res).to.equal(null);
    });
  });

  describe("shiftRow", () => {
    it("should return an identical row for a shift with no n specified", () => {
      var inArr=[1,2,3,4];
      var res=shiftRow(inArr);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(inArr));
    });
    it("should return an identical row for a shift with no n specified", () => {
      var inArr=[1,2,3,4];
      var res=shiftRow(inArr);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(inArr));
    });
    it("should return an identical row for a shift with n=0", () => {
      var inArr=[1,2,3,4];
      var res=shiftRow(inArr,0);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(inArr));
    });
    it("should return an identical row for a shift n%array.length==0", () => {
      var inArr=[1,2,3,4];
      var res=shiftRow(inArr,4);
      expect(JSON.stringify(res)).to.equal(JSON.stringify(inArr));
    });
    it("should shift by 1 for n=1", () => {
      var inArr=[1,2,3,4];
      var res=shiftRow(inArr,1);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([2,3,4,1]));
    });
    it("should shift by -1 for n=-1", () => {
      var inArr=[1,2,3,4];
      var res=shiftRow(inArr,-1);
      expect(JSON.stringify(res)).to.equal(JSON.stringify([4,1,2,3]));
    });
  });
});
