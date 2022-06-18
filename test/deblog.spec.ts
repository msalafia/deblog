import { IDeblogConfig } from "../src";
import { isTLogLevel, createDeblog, getDeblog, getDeblogs, clearDeblogs } from "../src/create_deblog";

describe("test isTLogLevel function", () => {
  it("should return true for admitted names of the console object methods", () => {
    const admitted_names = ["log", "debug", "info", "warn", "error"];

    admitted_names.forEach(name => expect(isTLogLevel(name)).toBe(true));
  });

  it("should return false for not admitted names of the console object methods", () => {
    const admitted_names = ["group", "endGroup", "table"];

    admitted_names.forEach(name => expect(isTLogLevel(name)).toBe(false));
  });
});

describe("test createDeblog for error handling of bad configuration objects", () => {
  it("should throw an error when the configuration object is not provided", () => {
    expect(() => createDeblog(<any>undefined)).toThrowError(
      "A configuration object is required in order to create a Deblog instance."
    );
  });

  it("should throw an error when the configuration object provide a log with no level in configurations", () => {
    const config = {
      id: "test",
      logs: [
        { name: "bark" },
      ]
    }
    expect(() => createDeblog(<any>config)).toThrowError(
      "Invalid log level: undefined"
    );
  });

  it("should return the original configuration object", () => {
    const config: IDeblogConfig = {
      logs: [
        { name: "bark", level: "log" }
      ]
    }

    const deblog = createDeblog(config);
    expect(deblog.getConfig()).toEqual(config);
  });

  it("should create a deblog with an undefined array of logs", () => {
    const config: IDeblogConfig = {
    }

    expect(() => createDeblog(config)).not.toThrow();
  });
});

describe("test createDeblog for proper deblog creation", () => {

  it("should create an id if not provided", () => {
    const config: IDeblogConfig = {
      logs: [
        { name: "bark", level: "log" }
      ]
    }

    const deblog = createDeblog(config);

    expect(deblog.id).toBeDefined();
    expect(typeof deblog.id).toEqual("string");
  });

  it("should create a new deblog object with bark and yell methods, and id", () => {
    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log" },
        { name: "yell", level: "log" }
      ]
    }

    const deblog = createDeblog(config);
    
    expect(deblog.bark).toBeDefined();
    expect(deblog.id).toEqual("test");
  });

  it("should create a new deblog object with methods disableAllBut() and restoreAll", () => {
    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log" }
      ]
    }

    const deblog = createDeblog(config);
    
    expect(deblog.disableAllBut).toBeDefined();
    expect(deblog.restoreAll).toBeDefined();
  });

  it("should create a log in the deblog object with methods enable(), disable(), restore()", () => {
    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log" }
      ]
    }

    const deblog = createDeblog(config);
    expect(deblog.bark.enable).toBeDefined();
    expect(deblog.bark.disable).toBeDefined();
    expect(deblog.bark.restore).toBeDefined();
  });

  it("should call the proper methods of the console object when the logs defined are called and enabled", () => {

    let mockedConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
    let mockedConsoleInfo = jest.spyOn(console, "info").mockImplementation(() => {});

    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log", tag: "[BARK]" },
        { name: "yell", level: "info", tag: "[YELL]" },
        { name: "quiet", level: "log", enabled: false }
      ]
    }

    const deblog = createDeblog(config);

    
    deblog.bark("I am barking in console.log");
    deblog.yell("I am yelling in console.info");
    deblog.quiet("I am quiet in console.log");
    expect(mockedConsoleLog).toBeCalledWith("[BARK]", "I am barking in console.log");
    expect(mockedConsoleInfo).toBeCalledWith("[YELL]", "I am yelling in console.info");
    expect(mockedConsoleLog).not.toBeCalledWith("undefined", "I am quiet in console.log");
    jest.restoreAllMocks();
  });

  it("should not print the logs named in disableAllBut() after this last is called", () => {
    let mockedConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
    let mockedConsoleInfo = jest.spyOn(console, "info").mockImplementation(() => {});

    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log" },
        { name: "yell", level: "info" },
        { name: "quiet", level: "log" }
      ]
    }

    const deblog = createDeblog(config);

    
    deblog.bark("I am barking in console.log");
    deblog.yell("I am yelling in console.info");
    deblog.quiet("I am quiet in console.log");

    expect(mockedConsoleLog).toBeCalledWith("undefined", "I am barking in console.log");
    expect(mockedConsoleInfo).toBeCalledWith("undefined", "I am yelling in console.info");
    expect(mockedConsoleLog).toBeCalledWith("undefined", "I am quiet in console.log");

    deblog.disableAllBut("bark");

    deblog.bark("Do bark me");
    deblog.yell("Don't yell me");
    deblog.quiet("Don't quiet me");

    expect(mockedConsoleLog).toBeCalledWith("undefined", "Do bark me");
    expect(mockedConsoleInfo).not.toBeCalledWith("undefined", "Don't yell me");
    expect(mockedConsoleLog).not.toBeCalledWith("undefined", "Don't quiet me");
    
    deblog.restoreAll();

    deblog.bark("Bark still logs");
    deblog.yell("Yell info logs again");
    deblog.quiet("Quite logs again");

    expect(mockedConsoleLog).toBeCalledWith("undefined", "Bark still logs");
    expect(mockedConsoleInfo).toBeCalledWith("undefined", "Yell info logs again");
    expect(mockedConsoleLog).toBeCalledWith("undefined", "Quite logs again");
    jest.restoreAllMocks();

  });

  it("should enable/disable logs methods when enable/disable methods are called", () => {
    let mockedConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log" },
        { name: "yell", level: "log" },
        { name: "quiet", level: "log", enabled: false }
      ]
    }

    const deblog = createDeblog(config);

    
    deblog.bark("Bark!");
    deblog.yell("Yell!");
    deblog.quiet("Quiet");

    expect(mockedConsoleLog).toBeCalledWith("undefined", "Bark!");
    expect(mockedConsoleLog).toBeCalledWith("undefined", "Yell!");
    expect(mockedConsoleLog).not.toBeCalledWith("undefined", "Quiet!");

    deblog.quiet.enable();

    deblog.quiet("Quiet again!");
    expect(mockedConsoleLog).toBeCalledWith("undefined", "Quiet again!");

    deblog.yell.disable();
    deblog.bark("Bark again!");
    deblog.yell("Yell again");

    expect(mockedConsoleLog).toBeCalledWith("undefined", "Bark again!");
    expect(mockedConsoleLog).not.toBeCalledWith("undefined", "Yell again");
    jest.restoreAllMocks();
  });
});

describe("test persistence of deblogs", () => {
  it("should do not persist a deblog in a repository by default. The method clearDeblogs() should remove all deblogs.", () => {

    const config: IDeblogConfig = {
      id: "test",
      logs: [
        { name: "bark", level: "log" },
      ]
    }

    const deblogNoPersistence = createDeblog(config);
    let res = getDeblog("test");
    expect(res).toBeUndefined();

    const config2: IDeblogConfig = {
      id: "test2",
      logs: [
        { name: "bark", level: "log" },
      ],
      persist: true
    }

    const config3: IDeblogConfig = {
      id: "test3",
      logs: [
        { name: "yell", level: "log" },
      ],
      persist: true
    }

    const deblog2 = createDeblog(config2);
    const deblog3 = createDeblog(config3);

    let res2 = getDeblog("test2");
    let res3 = getDeblog("test3");

    expect(res2).toBeDefined();
    expect(res2).toStrictEqual(deblog2);
    expect(res3).toStrictEqual(deblog3);

    let allDebs = getDeblogs();
    expect(allDebs).toHaveLength(2);
    expect(allDebs).toContain(deblog2);
    expect(allDebs).toContain(deblog3);

    clearDeblogs();
    allDebs = getDeblogs();
    expect(allDebs).toHaveLength(0);
  });
});