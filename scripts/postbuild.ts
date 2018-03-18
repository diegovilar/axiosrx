import * as fs from "fs";
import { resolve } from "path";

const PROJECT_ROOT = resolve(__dirname, "..");
const BUILD_ROOT = resolve(PROJECT_ROOT, "build");

makePackageJson()
copyDocs([`README.md`, `CHANGELOG.md`, `LICENSE`]);
process.exit(0);

function makePackageJson() {
    const sourcePackageFile = resolve(PROJECT_ROOT, "package.json");
    const destPackageFile = resolve(BUILD_ROOT, "package.json");

    const pkgObject = JSON.parse(fs.readFileSync(sourcePackageFile, { encoding: "utf8" }).toString());

    delete pkgObject.private;
    delete pkgObject.devDependencies;
    delete pkgObject.scripts;
    delete pkgObject.engines.yarn;
    delete pkgObject.engines.npm;

    fs.writeFileSync(destPackageFile, JSON.stringify(pkgObject, null, 4), { encoding: "utf8" });
    console.log(`Wrote ${destPackageFile}`);
}

function copyDocs(files: string[], srcDir = PROJECT_ROOT, destDir = BUILD_ROOT) {

    for (const file of files) {
        const src = resolve(srcDir, file);
        const dest = resolve(destDir, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Wrote ${dest}`);
        }
    }

}
