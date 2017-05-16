#!/usr/bin/env node

import 'isomorphic-fetch';
import 'colors';
import program from 'commander';
import parseHydraDocumentation from 'api-doc-parser/lib/hydra/parseHydraDocumentation';
import {version} from '../package.json';
import ReactCrudGenerator from './ReactCrudGenerator';

program
  .version(version)
  .description('Generate a CRUD application built with React, Redux and React Router from an Hydra-enabled API')
  .usage('apiEntrypoint outputDirectory')
  .option('-r, --resource [resourceName]', 'Generate CRUD for the given resource')
  .option('-p, --hydra-prefix [hydraPrefix]', 'The hydra prefix used by the API', 'hydra:')
  .parse(process.argv);

if (2 !== program.args.length) {
  program.help();
}

const generator = new ReactCrudGenerator(program.hydraPrefix);
const resourceToGenerate = program.resource ? program.resource.toLowerCase() : null;

parseHydraDocumentation(program.args[0]).then(api => {
    for (let resource of api.resources) {
      const nameLc = resource.name.toLowerCase();
      const titleLc = resource.title.toLowerCase();

      if (null === resourceToGenerate || nameLc === resourceToGenerate || titleLc === resourceToGenerate) {
        generator.generate(api, resource, program.args[1]);

        console.log('Code for the "%s" resource type has been generated!'.green, resource.title);
      }
    }
    generator.entrypoint(program.args[1]);
}).catch((e) => {
  console.log(e);
});
