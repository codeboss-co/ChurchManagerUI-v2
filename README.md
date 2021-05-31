# ChurchManagerUI - Angular

Church Manager frontend based on Angular Material

## Running

> ng serve

### Docker

> docker build -t church-manager-ui:prod .

> docker run -p 4200:80 --name church-manager-ui  church-manager-ui:prod

### Service worker

> Service workers do not work with `ng serve`! :stars: so we need a local web server 

`npm run build`

`npm run server`

```
You are able to pass in the docker environment variable ANGULAR_ENVIRONMENT if needed when its not Production
```

## Documentation

### Forms
[Form Arrays](https://www.concretepage.com/angular/angular-formarray-validation#:~:text=FormArray%20tracks%20the%20value%20and,FormControl%20or%20FormGroup%20are%20validated.)