var expect = chai.expect;
/*
  describe("Encryption and Decryption (16, 24, 32-bit)", () => {
    describe("aesEncrypt", () => {
      it ("returns correct encryption result for a known 16-bit example", () => {
        var pT='Two One Nine Two Hello Kitten I Am Your Father';
        var plain=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16);
        var key=txtToHex('YELLOW SUBMARINE');
        var res=aesEncrypt(plain,key,16).join("");
        expect(res).to.equal('33a3478cf32a270eeab4d529fb855f9acfc81ffac1ea0363df426ff24b74804957ececa9ffa3821a00591d2310977c06');
      });
      it ("returns correct encryption result for a known 24-bit example", () => {
        var pT='Two One Nine Two Hello Kitten I Am Your Father';
        var plain=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16);
        var key=txtToHex('YELLOW SUBMARINESSSSSSSS');
        var res=aesEncrypt(plain,key,24).join("");
        expect(res).to.equal('d3e3fb926bc3d0c4857687e12ca07c4548093dbf0d22450b366da3cc07f4406758f472c08902937d1d7a5c467a7c25c3');
      });
      it ("returns correct encryption result for a known 32-bit example", () => {
        var pT='Two One Nine Two Hello Kitten I Am Your Fatherca';
        var plain=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16);
        var key=txtToHex('catsandkudzuotherplants&animals!');
        var res=aesEncrypt(plain,key,32).join("");
        expect(res).to.equal('1ed6616276f41a620c491e219b768f511969196a68d96f12a3bc5bb58afc6718d04394b3ff82de9a9639ca39863fd2bc449665aee5b9d71d16fedf9ed49b9f01');
      });
      it ("does NOT throw error for correct input length but key length===numBytes", () => {
        expect(()=>aesEncrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],16)).not.to.throw();
      });
      it ("throws error for correct input length but key length<numBytes", () => {
        expect(()=>aesEncrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],16)).to.throw();
      });
      it ("throws error for correct input length but key length>numBytes", () => {
        expect(()=>aesEncrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],16)).to.throw();
      });
      it ("throws error for correct input length but missing key", () => {
        expect(()=>aesEncrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])).to.throw();
      });
      it ("throws error for input of number of bytes%16!==0", () => {
        expect(()=>aesEncrypt([1,2,3,4,5])).to.throw();
      });
      it ("throws error for an empty input of number of bytes", () => {
        expect(aesEncrypt).to.throw();
      });
    });
    describe("aesDecrypt", () => {
      it ("returns correct decryption result for cryptopals example", () => {
        let vI=atob(`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
        EZhyY9V9Lp2qNQDbl6JI39bDz+6pDmjJ2jlnpMCezRK89cG11IqiUWvIPxHj
        oiT1guH1uk4sQ2Pc1J4zjJNsZgoJDcPBbfss4kAqUJvQyFbzWshhtVeAv3dm
        gwUENIhNK/erjpgw2BIRayzYw001jAIF5c7rYg38o6x3YdAtU3d3QpuwG5xD
        fODxzfL3yEKQr48C/KqxI87uGwyg6H5gc2AcLU9JYt5QoDFoC7PFxcE3RVqc
        7/Um9Js9X9UyriEjftWt86/tEyG7F9tWGxGNEZo3MOydwX/7jtwoxQE5ybFj
        WndqLp8DV3naLQsh/Fz8JnTYHvOR72vuiw/x5D5PFuXV0aSVvmw5Wnb09q/B
        owS14WzoHH6ekaWbh78xlypn/L/M+nIIEX1Ol3TaVOqIxvXZ2sjm86xRz0Ed
        oHFfupSekdBULCqptxpFpBshZFvauUH8Ez7wA7wjL65GVlZ0f74U7MJVu9Sw
        sZdgsLmnsQvr5n2ojNNBEv+qKG2wpUYTmWRaRc5EClUNfhzh8iDdHIsl6edO
        ewORRrNiBay1NCzlfz1cj6VlYYQUM9bDEyqrwO400XQNpoFOxo4fxUdd+AHm
        CBhHbyCR81/C6LQTG2JQBvjykG4pmoqnYPxDyeiCEG+JFHmP1IL+jggdjWhL
        WQatslrWxuESEl3PEsrAkMF7gt0dBLgnWsc1cmzntG1rlXVi/Hs2TAU3RxEm
        MSWDFubSivLWSqZj/XfGWwVpP6fsnsfxpY3d3h/fTxDu7U8GddaFRQhJ+0ZO
        dx6nRJUW3u6xnhH3mYVRk88EMtpEpKrSIWfXphgDUPZ0f4agRzehkn9vtzCm
        NjFnQb0/shnqTh4Mo/8oommbsBTUKPYS7/1oQCi12QABjJDt+LyUan+4iwvC
        i0k0IUIHvk21381vC0ixYDZxzY64+xx/RNID+iplgzq9PDZgjc8L7jMg+2+m
        rxPS56e71m5E2zufZ4d+nFjIg+dHD/ShNPzVpXizRVUERztLuak8Asah3/yv
        wOrH1mKEMMGC1/6qfvZUgFLJH5V0Ep0n2K/Fbs0VljENIN8cjkCKdG8aBnef
        EhITdV7CVjXcivQ6efkbOQCfkfcwWpaBFC8tD/zebXFE+JshW16D4EWXMnSm
        /9HcGwHvtlAj04rwrZ5tRvAgf1IR83kqqiTvqfENcj7ddCFwtNZrQK7EJhgB
        5Tr1tBFcb9InPRtS3KYteYHl3HWR9t8E2YGE8IGrS1sQibxaK/C0kKbqIrKp
        npwtoOLsZPNbPw6K2jpko9NeZAx7PYFmamR4D50KtzgELQcaEsi5aCztMg7f
        p1mK6ijyMKIRKwNKIYHagRRVLNgQLg/WTKzGVbWwq6kQaQyArwQCUXo4uRty
        zGMaKbTG4dns1OFB1g7NCiPb6s1lv0/lHFAF6HwoYV/FPSL/pirxyDSBb/FR
        RA3PIfmvGfMUGFVWlyS7+O73l5oIJHxuaJrR4EenzAu4Avpa5d+VuiYbM10a
        LaVegVPvFn4pCP4U/Nbbw4OTCFX2HKmWEiVBB0O3J9xwXWpxN1Vr5CDi75Fq
        NhxYCjgSJzWOUD34Y1dAfcj57VINmQVEWyc8Tch8vg9MnHGCOfOjRqp0VGyA
        S15AVD2QS1V6fhRimJSVyT6QuGb8tKRsl2N+a2Xze36vgMhw7XK7zh//jC2H`).split("").map(e=>txtToHex(e)).join("");
        vI=hexByTwo(vI);
        var key=txtToHex('YELLOW SUBMARINE');
        var res=aesDecrypt(vI,key,16).map(e=>hexToTxt(e)).join("");
        expect(res).to.equal(`I\'m back and I\'m ringin\' the bell \nA rockin\' on the mike while the fly girls yell \nIn ecstasy in the back of me \nWell that\'s my DJ Deshay cuttin\' all them Z\'s \nHittin\' hard and the girlies goin\' crazy \nVanilla\'s on the mike, man I\'m not lazy. \n\nI\'m lettin\' my drug kick in \nIt controls my mouth and I begin \nTo just let it flow, let my concepts go \nMy posse\'s to the side yellin\', Go Vanilla Go! \n\nSmooth \'cause that\'s the way I will be \nAnd if you don\'t give a damn, then \nWhy you starin\' at me \nSo get off \'cause I control the stage \nThere\'s no dissin\' allowed \nI\'m in my own phase \nThe girlies sa y they love me and that is ok \nAnd I can dance better than any kid n\' play \n\nStage 2 -- Yea the one ya\' wanna listen to \nIt\'s off my head so let the beat play through \nSo I can funk it up and make it sound good \n1-2-3 Yo -- Knock on some wood \nFor good luck, I like my rhymes atrocious \nSupercalafragilisticexpialidocious \nI\'m an effect and that you can bet \nI can take a fly girl and make her wet. \n\nI\'m like Samson -- Samson to Delilah \nThere\'s no denyin\', You can try to hang \nBut you\'ll keep tryin\' to get my style \nOver and over, practice makes perfect \nBut not if you\'re a loafer. \n\nYou\'ll get nowhere, no place, no time, no girls \nSoon -- Oh my God, homebody, you probably eat \nSpaghetti with a spoon! Come on and say it! \n\nVIP. Vanilla Ice yep, yep, I\'m comin\' hard like a rhino \nIntoxicating so you stagger like a wino \nSo punks stop trying and girl stop cryin\' \nVanilla Ice is sellin\' and you people are buyin\' \n\'Cause why the freaks are jockin\' like Crazy Glue \nMovin\' and groovin\' trying to sing along \nAll through the ghetto groovin\' this here song \nNow you\'re amazed by the VIP posse. \n\nSteppin\' so hard like a German Nazi \nStartled by the bases hittin\' ground \nThere\'s no trippin\' on mine, I\'m just gettin\' down \nSparkamatic, I\'m hangin\' tight like a fanatic \nYou trapped me once and I thought that \nYou might have it \nSo step down and lend me your ear \n\'89 in my time! You, \'90 is my year. \n\nYou\'re weakenin\' fast, YO! and I can tell it \nYour body\'s gettin\' hot, so, so I can smell it \nSo don\'t be mad and don\'t be sad \n\'Cause the lyrics belong to ICE, You can call me Dad \nYou\'re pitchin\' a fit, so step back and endure \nLet the witch doctor, Ice, do the dance to cure \nSo come up close and don\'t be square \nYou wanna battle me -- Anytime, anywhere \n\nYou thought that I was weak, Boy, you\'re dead wrong \nSo come on, everybody and sing this song \n\nSay -- Play that funky music Say, go white boy, go white boy go \nplay that funky music Go white boy, go white boy, go \nLay down and boogie and play that funky music till you die. \n\nPlay that funky music Come on, Come on, let me hear \nPlay that funky music white boy you say it, say it \nPlay that funky music A little louder now \nPlay that funky music, white boy Come on, Come on, Come on \nPlay that funky music \n\u0004\u0004\u0004\u0004`);
      });
      it ("returns correct decryption result for a known 16-bit example", () => {
        var cipher=hexByTwo('29c3505f571420f6402299b31a02d73a');
        var key=txtToHex('Thats my Kung Fu');
        var res=aesDecrypt(cipher,key,16).join("");
        expect(res).to.equal('54776f204f6e65204e696e652054776f');
      });
      it ("returns correct decryption result for a known 24-bit example", () => {
        var cipher=hexByTwo('d3e3fb926bc3d0c4857687e12ca07c4548093dbf0d22450b366da3cc07f440672b7f144f6df618465c2db23ce631236a');
        var key=txtToHex('YELLOW SUBMARINESSSSSSSS');
        var res=aesDecrypt(cipher,key,24).join("");
        expect(res).to.equal('54776f204f6e65204e696e652054776f2048656c6c6f204b697474656e204920416d20596f7572204661746865724444');
      });
      it ("returns correct decryption result for a known 32-bit example", () => {
        var cipher=hexByTwo('1ed6616276f41a620c491e219b768f511969196a68d96f12a3bc5bb58afc6718d04394b3ff82de9a9639ca39863fd2bc');
        var key=txtToHex('catsandkudzuotherplants&animals!');
        var res=aesDecrypt(cipher,key,32).join("");
        expect(res).to.equal('54776f204f6e65204e696e652054776f2048656c6c6f204b697474656e204920416d20596f7572204661746865726361');
      });
      it ("does NOT throw error for correct input length but key length===numBytes", () => {
        expect(()=>aesDecrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],16)).not.to.throw();
      });
      it ("throws error for correct input length but key length<numBytes", () => {
        expect(()=>aesDecrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],16)).to.throw();
      });
      it ("throws error for correct input length but key length>numBytes", () => {
        expect(()=>aesDecrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],16)).to.throw();
      });
      it ("throws error for correct input length but missing key", () => {
        expect(()=>aesDecrypt([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])).to.throw();
      });
      it ("throws error for input of number of bytes%16!==0", () => {
        expect(()=>aesDecrypt([1,2,3,4,5])).to.throw();
      });
      it ("throws error for an empty input of number of bytes", () => {
        expect(aesEncrypt).to.throw();
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
*/
