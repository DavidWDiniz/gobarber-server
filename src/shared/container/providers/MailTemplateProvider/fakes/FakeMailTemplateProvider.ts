import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvider{
    async parse(): Promise<string> {
        return "Mail Content";
    }
}

export default FakeMailTemplateProvider;
