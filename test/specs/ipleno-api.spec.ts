import { expect } from "chai";
import { suite, test, timeout } from "mocha-typescript";
// import "rxjs/add/operator/toPromise";
import { IplenoApi } from "../../src/ipleno-api";

@suite("IplenoApi", timeout(10000))
class SuiteApi1 {

    protected api: IplenoApi;

    public before() {

        this.api = new IplenoApi();

    }

    @test("Observable")
    public testObservable(done: (error?: any) => void) {

        const sub = this.api.getLogSessao(11233).subscribe((log) => {
            try {
                expect(log.length).to.equal(22);
                done();
            } catch (e) {
                done(e);
            }
        });

    }

    @test("Promise")
    public async testPromise() {

        const data = await this.api.getLogSessao(11233).toPromise();
        expect(data.length).to.equal(22);

    }

}
