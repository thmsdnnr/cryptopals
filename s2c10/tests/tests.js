var expect = chai.expect;
  describe("Encryption and Decryption (16, 24, 32-bit)", () => {
    describe("aesEncryptCBC", () => {
      it ("returns correct encryption result for a known 16-bit example", () => {
        var pT='Two One Nine Two Hello Kitten I Am Your Father';
        var plain=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16);
        var key=txtToHex('YELLOW SUBMARINE');
        var IV=hexByTwo('000102030405060708090a0b0c0d0e0f');
        var res=aesEncryptCBC(plain,key,IV,16).join("");
        expect(res).to.equal('1476757a4b7ee07d2a33dc26597c940e7139bb36cdd48ce4932d728aef00822b8d47a556ea903e198a65018f0d52a29e');
      });
      it ("returns correct encryption result for a known 24-bit example", () => {
        var pT='Two One Nine Twomoreandmoreandmore';
        var plain=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16);
        var key=txtToHex('YELLOW SUBMARINESSSSSSSS');
        var IV=hexByTwo('000102030405060708090a0b0c0d0e0f');
        var res=aesEncryptCBC(plain,key,IV,24).join("");
        expect(res).to.equal('4b70053204f3eee3cabae044e59f13cfa3ff9979b17ef2e0c0bc1d8090dc587dd663259060f768444d652db4d4f12f22');
      });
      it ("returns correct encryption result for a known 32-bit example", () => {
        var pT='Two One Nine Two Hello Kitten I Am Your Fatherca';
        var plain=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16);
        var key=txtToHex('catsandkudzuotherplants&animals!');
        var IV=hexByTwo('000102030405060708090a0b0c0d0e0f');
        var res=aesEncryptCBC(plain,key,IV,32).join("");
        expect(res).to.equal('4e6a18fa683953d23cb2c16d08690e18fa6e961e05a90cd9d7a9f73122b61a1f86e43af6ef0786dc00f72df5faef75168b9fe0f1a8e9b778d3f8cf91363ddbd4');
      });
      it ("does NOT throw error for correct input length but key length===numBytes", () => {
        expect(()=>aesEncryptCBC(
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).not.to.throw();
      });
      it ("throws error for correct input length but key length<numBytes", () => {
        expect(()=>aesEncryptCBC(
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).to.throw();
      });
      it ("throws error for correct input length but key length>numBytes", () => {
        expect(()=>aesEncryptCBC(
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).to.throw();
      });
      it ("throws error for correct input length but missing key", () => {
        expect(()=>aesEncryptCBC(
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],null,
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],16)).to.throw();
      });
      it ("throws error for correct input length but missing initialization vector", () => {
        expect(()=>aesEncryptCBC(
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          null,16)).to.throw();
      });
      it ("throws error for input of number of bytes%16!==0", () => {
        expect(()=>aesEncryptCBC([1,2,3,4,5],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
        16)).to.throw();
      });
      it ("throws error for an empty input of number of bytes", () => {
        expect(aesEncryptCBC).to.throw();
      });
    });
    describe("aesDecryptCBC", () => {
      it ("returns correct decryption result for a known 16-bit example", () => {
        var cipher=hexByTwo('1476757a4b7ee07d2a33dc26597c940e7139bb36cdd48ce4932d728aef00822b8d47a556ea903e198a65018f0d52a29e');
        var key=txtToHex('YELLOW SUBMARINE');
        var IV=hexByTwo('000102030405060708090a0b0c0d0e0f');
        var res=hexToText(chopPKCS7(aesDecryptCBC(cipher,key,IV,16)).join(""));
        expect(res).to.equal('Two One Nine Two Hello Kitten I Am Your Father');
      });
      it ("returns correct decryption result for a known 24-bit example", () => {
        var cipher=hexByTwo('4b70053204f3eee3cabae044e59f13cfa3ff9979b17ef2e0c0bc1d8090dc587dd663259060f768444d652db4d4f12f22');
        var key=txtToHex('YELLOW SUBMARINESSSSSSSS');
        var IV=hexByTwo('000102030405060708090a0b0c0d0e0f');
        var res=hexToText(chopPKCS7(aesDecryptCBC(cipher,key,IV,24)).join(""));
        expect(res).to.equal('Two One Nine Twomoreandmoreandmore');
      });
      it ("returns correct decryption result for a known 32-bit example", () => {
        var cipher=hexByTwo('4e6a18fa683953d23cb2c16d08690e18fa6e961e05a90cd9d7a9f73122b61a1f86e43af6ef0786dc00f72df5faef75168b9fe0f1a8e9b778d3f8cf91363ddbd4');
        var key=txtToHex('catsandkudzuotherplants&animals!');
        var IV=hexByTwo('000102030405060708090a0b0c0d0e0f');
        var res=hexToText(chopPKCS7(aesDecryptCBC(cipher,key,IV,32)).join(""));
        expect(res).to.equal('Two One Nine Two Hello Kitten I Am Your Fatherca');
      });
      it ("does NOT throw error for correct input length but key length===numBytes", () => {
        expect(()=>aesDecryptCBC([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).not.to.throw();
      });
      it ("throws error for correct input length but key length<numBytes", () => {
        expect(()=>aesDecryptCBC([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).to.throw();
      });
      it ("throws error for correct input length but key length>numBytes", () => {
        expect(()=>aesDecryptCBC([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).to.throw();
      });
      it ("throws error for correct input length but missing key", () => {
        expect(()=>aesDecryptCBC([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          null,
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          16)).to.throw();
      });
      it ("throws error for correct input length but missing initialization vector", () => {
        expect(()=>aesDecryptCBC([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
          null,
          16)).to.throw();
      });
      it ("throws error for input of number of bytes%16!==0", () => {
        expect(()=>aesDecryptCBC([1,2,3,4,5],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],16)).to.throw();
      });
      it ("throws error for an empty input of number of bytes", () => {
        expect(aesEncryptCBC).to.throw();
      });
    });
  });

  describe("Expanded Key Generation", () => {
    describe("generateExpandedKey", () => {
      it("generates an expanded key to spec @ 128-bits", () => {
        var key=["2b","7e","15","16","28","ae","d2","a6","ab","f7","15","88","09","cf","4f","3c"];
        var eK=generateExpandedKey(key,16);
        expect(eK.length).to.equal(176);
      });
      it("generates an expanded key to spec @ 192-bits", () => {
        var key=["8e","73","b0","f7","da","0e","64","52","c8","10","f3","2b","80","90","79","e5","62","f8","ea","d2","52","2c","6b","7b"];
        var eK=generateExpandedKey(key,24);
        expect(eK.length).to.equal(208);
      });
      it("generates an expanded key to spec @ 256-bits", () => {
        var key=["60","3d","eb","10","15","ca","71","be","2b","73","ae","f0","85","7d","77","81","1f","35","2c","07","3b","61","08","d7",
        "2d","98","10","a3","09","14","df","f4"];
        var eK=generateExpandedKey(key,32);
        expect(eK.length).to.equal(240);
      });
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
        expect(res.length).to.equal(240);
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
  });
  describe("Encrypt/Decrypt Subprocesses", () => {
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
    describe("sRow: applies shiftRow to a 4x4 state matrix", () => {
      it("returns null if not given any state", () => {
        expect(sRow()).to.equal(null);
      });
      it("shifts a 4x4 matrix of rows to the left by row# places if encryption=false", () => {
        var res=sRow([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],false);
        res=mToBytes(res);
        expect(JSON.stringify(res)).to.equal(JSON.stringify([1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3, 16, 13, 10, 7, 4]));
      });
      it("shifts a 4x4 matrix of rows to the right by row# places if encryption=true", () => {
        var res=sRow([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],true);
        res=mToBytes(res);
        expect(JSON.stringify(res)).to.equal(JSON.stringify([1,6,11,16,5,10,15,4,9,14,3,8,13,2,7,12]));
      });
    });
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
  });
  describe("Padding Functions", () => {
    describe("padToN", () => {
      it ("returns null if N is not specified", () => {
        var arr='heykitteh'.split("");
        var res=padToN(arr,null,"C");
        expect(res).to.equal(null);
      });
      it ("returns null if no array is given", () => {
        var res=padToN();
        expect(res).to.equal(null);
      });
      it ("returns null if it is passed a parameter that is not an array", () => {
        var res=padToN('a string not an array',16,'C');
        expect(res).to.equal(null);
      });
      it ("returns null if N is less than array length", () => {
        var arr='heykitteh'.split("");
        var res=padToN(arr,8,'C');
        expect(res).to.equal(null);
      });
      it ("returns null if the pad character length is wrong size to pad remaining spaces", () => {
        var arr='heykitteh'.split("");
        var res=padToN(arr,10,'CD');
        expect(res).to.equal(null);
      });
      it ("returns null if the pad character length not the same length as the first array element (enforce uniformity)", () => {
        var arr='heykitteh'.split("");
        var res=padToN(arr,11,'CD');
        expect(res).to.equal(null);
      });
      it ("pads array to length N with specified character given valid inputs", () => {
        var arr='heykitteh'.split("");
        var res=padToN(arr,13,'C').join("");
        expect(res).to.equal('heykittehCCCC');
      });
    });
    describe("hexPad", () => {
      it ("returns an empty string if given an empty string", () => {
        expect(hexPad('')).to.equal('');
      });
      it ("returns a 2 character hex value unmodified", () => {
        expect(hexPad('AF')).to.equal('AF');
      });
      it ("pads a single character hex value with a leading zero", () => {
        expect(hexPad('e')).to.equal('0e');
      });
    });
    describe("PKCS7", () => {
      it ("returns null for an empty array", () => {
        var res=PKCS7([],16);
        expect(res).to.equal(null);
      });
      it ("returns null for an unspecified block size", () => {
        var res=PKCS7([]);
        expect(res).to.equal(null);
      });
      it ("returns null if it is not fed an array", () => {
        var res=PKCS7('definitelynotanarray',16);
        expect(res).to.equal(null);
      });
      it ("pads a block with len%16==0 with 16 0x10 characters with blockSz=16", () => {
        var block=hexByTwo('AABB0F1345121314AABBCCDDEEFFAABB');
        var res=PKCS7(block,16).join("");
        expect(res).to.equal('AABB0F1345121314AABBCCDDEEFFAABB10101010101010101010101010101010');
      });
      it ("pads a block with len%16==4 with 4 0x04 characters with blockSz=16", () => {
        var block=hexByTwo('331144551130AABB0F134512');
        var res=PKCS7(block,16).join("");
        expect(res).to.equal('331144551130AABB0F13451204040404');
      });
      it ("pads a block with len%16==14 with 14 0x0E characters with blockSz=16", () => {
        var block=hexByTwo('AACC');
        var res=PKCS7(block,16).join("");
        expect(res).to.equal('AACC0e0e0e0e0e0e0e0e0e0e0e0e0e0e');
      });
    });
    describe("chopPKCS7", () => {
      it("returns null if not given an array", () => {
        expect(chopPKCS7('not an array')).to.equal(null);
      });
      it("returns null if given an empty array", () => {
        expect(chopPKCS7([])).to.equal(null);
      });
      it("returns original array if given array that does not end in 0x00 thru 0x0F", () => {
        var dontCutMe=['00','44','EE','EF'];
        var res=chopPKCS7(dontCutMe);
        expect(res).to.equal(dontCutMe);
      });
      it("returns array truncated by number of bytes of last character", () => {
        var sliced=['00','44','EE','EF'];
        var dontCutMe=['00','44','EE','EF','02','02'];
        var res=chopPKCS7(dontCutMe);
        expect(JSON.stringify(res)).to.equal(JSON.stringify(sliced));
      });
      it("throws an error if the amount to be sliced is greater than the array length", () => {
        var dontCutMe=['00','44','EE','05'];
        expect(()=>chopPKCS7(dontCutMe)).to.throw();
      });
      it("throws an error if bits to be chopped are not equal (non-PKCS7-padded input)", () => {
        var dontCutMe=['00','44','EE','05','02','03'];
        expect(()=>chopPKCS7(dontCutMe)).to.throw();
      });
    });
  });
  describe("Helper Functions: State Matrix Manipulation", () => {
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
    describe("mToBytes", () => {
      it ("returns null if given an empty array", () => {
        var res=mToBytes([]);
        expect(res).to.equal(null);
      });
      it ("returns null if passed a non-array type", () => {
        var res=mToBytes('notanarray');
        expect(res).to.equal(null);
      });
      it ("returns null if the state matrix is malformed (fewer than 16 values)", () => {
        var m=[[1,5,9,13],[2,6,10,14],[3,7,11,15],[4,8,12]];
        var res=mToBytes(m);
        expect(res).to.equal(null);
      });
      it ("returns null if the state matrix is malformed (greater than 16 values)", () => {
        var m=[[1,5,9,13],[2,6,10,14],[3,7,11,15],[4,8,12,16,17]];
        var res=mToBytes(m);
        expect(res).to.equal(null);
      });
      it ("returns null if the state matrix is malformed (missing a row)", () => {
        var m=[[1,5,9,13],[2,6,10,14],[3,7,11,15]];
        var res=mToBytes(m);
        expect(res).to.equal(null);
      });
      it ("returns null if the state matrix is malformed (missing a column)", () => {
        var m=[[1,5,9],[2,6,10],[3,7,11],[4,4,4]];
        var res=mToBytes(m);
        expect(res).to.equal(null);
      });
      it ("converts state matrix to flattened array reading row-wise one column at a time", () => {
        var m=[[1,5,9,13],[2,6,10,14],[3,7,11,15],[4,8,12,16]];
        var expRes=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
        var res=mToBytes(m);
        expect(JSON.stringify(res)).to.equal(JSON.stringify(expRes));
      })
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
  });
  describe("Helper Functions: Number Conversion and Bit Manipulation", () => {
    describe("hexXOR", () => {
      it("returns hex XOR result as hex", () => {
        var res=hexXOR('0E','0B');
        expect(res).to.equal('5');
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
  });
