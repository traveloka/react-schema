# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.1"></a>
## [2.0.1](https://github.com/Jekiwijaya/react-schema/compare/v2.0.0...v2.0.1) (2018-09-03)


### Bug Fixes

* validate field before submit ([6d37ba8](https://github.com/Jekiwijaya/react-schema/commit/6d37ba8))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/Jekiwijaya/react-schema/compare/v1.0.6...v2.0.0) (2018-08-31)


### Bug Fixes

* **form:** change onChange to onChangeField for Form prop ([be2662a](https://github.com/Jekiwijaya/react-schema/commit/be2662a))
* bug when container rerender, form is reconstruct. ([044f9d4](https://github.com/Jekiwijaya/react-schema/commit/044f9d4))
* remove value as props. ([37a1583](https://github.com/Jekiwijaya/react-schema/commit/37a1583))
* test ([fc5e608](https://github.com/Jekiwijaya/react-schema/commit/fc5e608))


### Features

* **field:** instead pass fieldComponent and fieldProps, using hoc createField instead. ([4f38a63](https://github.com/Jekiwijaya/react-schema/commit/4f38a63))
* **form:** able to handle nestedForm ([9fcc567](https://github.com/Jekiwijaya/react-schema/commit/9fcc567))
* **form:** add option revalidateOnError and validateOnChange. ([988c6ba](https://github.com/Jekiwijaya/react-schema/commit/988c6ba))


### BREAKING CHANGES

* **form:** - form: setValue(name) to setValueField(name)
- form: getValue(name) to getValueField(name)
- form: setError(name) to setErrorField(name)
- form: getError(name) to getErrorField(name)





<a name="1.0.6"></a>
## [1.0.6](https://github.com/Jekiwijaya/react-schema/compare/v1.0.5...v1.0.6) (2018-08-23)

**Note:** Version bump only for package @traveloka/react-schema-form





<a name="1.0.5"></a>
## [1.0.5](https://github.com/Jekiwijaya/react-schema/compare/v1.0.4...v1.0.5) (2018-08-21)


### Bug Fixes

* **form:** fixing error access el.entities. ([e42e82e](https://github.com/Jekiwijaya/react-schema/commit/e42e82e))





<a name="1.0.4"></a>
## [1.0.4](https://github.com/Jekiwijaya/react-schema/compare/v1.0.3...v1.0.4) (2018-08-21)


### Bug Fixes

* **field:** add label property. ([34da58d](https://github.com/Jekiwijaya/react-schema/commit/34da58d))





<a name="1.0.3"></a>
## [1.0.3](https://github.com/Jekiwijaya/react-schema/compare/v1.0.2...v1.0.3) (2018-08-16)


### Bug Fixes

* **form:** fixing validate return error cycle. ([1f9aee8](https://github.com/Jekiwijaya/react-schema/commit/1f9aee8))





<a name="1.0.2"></a>
## [1.0.2](https://github.com/Jekiwijaya/react-schema/compare/v1.0.1...v1.0.2) (2018-08-16)


### Bug Fixes

* validate return null when all fields is valid. ([e6efa31](https://github.com/Jekiwijaya/react-schema/commit/e6efa31))





<a name="1.0.1"></a>
## 1.0.1 (2018-08-16)

**Note:** Version bump only for package @traveloka/react-schema-form
