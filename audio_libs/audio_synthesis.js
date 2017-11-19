var osc_synthesis = function(a, f, t){
    if (a == 0){
        return 0;
    }
    return a * Math.sin(2 * Math.PI * f * t + Math.PI/4)
};

var sinus_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return osc_synthesis(args.a, args.f, args.t);
};

var additive_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return osc_synthesis(args.a1, args.f1, args.t) + osc_synthesis(args.a2, args.f2, args.t);  
};

var am_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return args.a * osc_synthesis((args.c + osc_synthesis(args.a, args.fm, args.t))/(args.c + args.a), args.fc, args.t);
};

var fm_synthesis = function (args){
    if (args.a == 0){
        return 0;
      ;    }
    return args.a * Math.sin((2 * Math.PI * args.fc * args.t) + osc_synthesis(args.I, args.fm, args.t));
};

var calc_a = function (f, f0){
	return ((2 * f0) - f)/f0;
};
