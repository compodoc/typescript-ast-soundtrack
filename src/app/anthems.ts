export const ANTHEMS = {
    belgium: `@Component({
  selector: 'belgium',
  templateUrl: './belgium.component.html'
})
export class BelgiumComponent {
    @length(0)
    @Output() myEvent:EventEmitter = new EventEmitter();

    @length(1)
    fx2() {}

    @length(0)
    @Input() prop8;

    @length(2)
    @Output() myEvent:EventEmitter = new EventEmitter();

    @length(1)
    @HostBinding('class.prop1') prop1;

    @length(0)
    @HostListener('click', ['$event']) onFx1(e) {}

    @length(0)
    @ContentChild('myPredicate3') myChildComponent3;

    @length(0)
    @HostListener('click', ['$event']) onFx1(e) {}

    @length(0)
    @ContentChild('myPredicate3') myChildComponent3;

    @length(0)
    @ViewChild('myPredicate1') myChildComponent1;

    @length(3)
    @Output() myEvent:EventEmitter = new EventEmitter();

    @length(0)
    @HostListener('click', ['$event']) onFx1(e) {}

    @length(0)
    @HostBinding('class.prop1') prop1;

    @length(2)
    @Output() myEvent:EventEmitter = new EventEmitter();

    @length(1)
    @HostListener('click', ['$event']) onFx1(e) {}

    @length(0)
    @ContentChild('myPredicate3') myChildComponent3;

    @length(3)
    @ContentChildren('myPredicat4') myChildComponents1;
}
    `,
    french: `@Component({
  selector: 'french',
  templateUrl: './french.component.html'
})
export class FrenchComponent {

    @length(0)
    fx1() {}

    @length(1)
    fx2() {}

    @length(0)
    fx3() {}

    @length(1)
    @HostBinding('class.prop1') prop1;

    @length(1)
    @HostBinding('class.prop2') prop2;

    @length(1)
    @HostListener('click', ['$event']) onFx1(e) {}

    @length(1)
    @HostListener('click', ['$event']) onFx2(e) {}

    @length(2)
    @ViewChild('myPredicate1') myChildComponent1;

    @length(0)
    @ContentChild('myPredicate3') myChildComponent3;

    @length(1)
    @HostBinding('class.prop3') prop4;

    @length(0)
    @HostBinding('class.prop4') prop5;

    @length(1)
    @ContentChild('myPredicate4') myChildComponent4;

    @length(0)
    @HostBinding('class.prop7') prop7;

    @length(1)
    @Input() prop8;

    @length(3)
    @ContentChildren('myPredicat4') myChildComponents1;

    @length(1)
    @HostListener('click', ['$event']) onFx3(e) {}

    @length(0)
    @Output() myEvent:EventEmitter = new EventEmitter();

    @length(3)
    @HostBinding('class.prop8') prop8;
}
    `
}

/*

length :
0 : very short
1 : short
2 : normal
3 : long

marseilleise

re 0
re 1
re 0
sol 1
sol 1
la 1
la 1
re (octave 2) 2
si 0
sol 1
sol 0
si 1
sol 0
mi 1
do (octave 2) 3
la 1
fa 0
sol 3

brabançonne

sol
mi
fa
sol
la
si
do (octave 2)
si
do (octave 2)
mi (octave 2)
sol
la
sol
si
do (octave 2)
re (octave 2)

brabançonne https://www.youtube.com/watch?v=ioG9cSlVyfA

fa 0
re 1
mi 0
fa 2
sol 1
la 0
si 0
la 0
si 0
re (octave 2) 0
fa 3
la 0
sol 0
fa 2
la 1
si 0
do (octave 2) 3

 */
