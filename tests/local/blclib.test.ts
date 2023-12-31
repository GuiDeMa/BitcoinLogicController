import { expect } from 'chai'
import { assert, method, SmartContract } from 'scrypt-ts'
import { Blclib } from '../../src/index'

// Test lib directly:
describe('Test SmartContractLib `Blclib`', () => {
    it('static function call', () => {
        expect(Blclib.add(1n, 2n)).to.eq(3n)
    })

    it('method call', () => {
        const myLib = new Blclib(5n)
        expect(myLib.diff(2n)).to.eq(3n)
    })
})

// Test via smart contract:
class TestLibContract extends SmartContract {
    @method()
    public unlock1(x: bigint) {
        assert(Blclib.add(1n, 2n) === x)
    }

    @method()
    public unlock2(x: bigint) {
        const myLib = new Blclib(5n)
        assert(myLib.diff(2n) === x)
    }
}

describe('Test SmartContractLib `Lib`', () => {
    before(async () => {
        await TestLibContract.compile()
    })

    it('should pass integration test successfully.', () => {
        const testLib = new TestLibContract()

        let result = testLib.verify((self) => self.unlock1(3n))
        expect(result.success, result.error).to.be.true

        result = testLib.verify((self) => self.unlock2(3n))
        expect(result.success, result.error).to.be.true
    })
})
