import { Dropbox } from 'dropbox';

const dbx = new Dropbox({
    accessToken: '',
});

console.log(dbx);	// { accessToken: '' }