import { expect } from "chai";
import { suite, test, timeout } from "mocha-typescript";
import { AxiosRx } from "../../src/axios-rx";

const TEST_URL = "http://www.google.com";

@suite("AxiosRx", timeout(10000))
class SuiteApi1 {

    protected instance: AxiosRx;

    public before() {

        this.instance = new AxiosRx();

    }

    @test("Observable")
    public testObservable(done: (error?: any) => void) {

        const sub = this.instance.head(TEST_URL).subscribe((response) => {
            try {
                expect(response.status).to.be.gte(200);
                done();
            } catch (e) {
                done(e);
            }
        });

    }

    @test("Promise")
    public async testPromise() {

        const response = await this.instance.head(TEST_URL).toPromise();
        expect(response.status).to.be.gte(200);

    }

}
